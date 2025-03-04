import orderBy from "lodash.orderby"
import { useCallback, useMemo } from "react"
import { parseAsBoolean, useQueryState } from "nuqs"
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient
} from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { Ticket } from "@/types/db"
import type { InfiniteData } from "@tanstack/react-query"

export function useTicketsQuery(enabled = true) {
  const queryClient = useQueryClient()

  const [closed] = useQueryState("closed", parseAsBoolean.withDefault(false))
  const [search] = useQueryState("search", { defaultValue: "" })

  const { data, ...query } = useInfiniteQuery({
    enabled,
    queryKey: ["tickets", closed, search],
    placeholderData: keepPreviousData,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({ closed: `${closed}` })
      if (search) params.set("search", search)
      if (pageParam) params.set("cursor", pageParam)
      const { data } = await api.get<TicketsWithCursor>(`/admin/tickets`, {
        params
      })
      return data
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  const formattedData = useMemo(() => {
    return orderBy(
      data?.pages.flatMap((page) => page.tickets) || [],
      "lastMessageAt",
      "desc"
    )
  }, [data])

  type TicketData = TicketsWithCursor["tickets"][number]

  const addTicket = useCallback(
    (ticket: Ticket) => {
      queryClient.setQueryData<InfiniteData<TicketsWithCursor>>(
        ["tickets", !!ticket.closed, search],
        (prev) => {
          if (!prev) {
            return {
              pages: [{ tickets: [{ ...ticket, unseenMessages: 0 }] }],
              pageParams: []
            }
          }
          return {
            ...prev,
            pages: prev.pages.map((page, index) => ({
              ...page,
              tickets:
                index === 0
                  ? [{ ...ticket, unseenMessages: 0 }, ...page.tickets]
                  : page.tickets
            }))
          }
        }
      )
    },
    [queryClient, search]
  )

  const updateTicket = useCallback(
    (
      id: string,
      data?: Partial<TicketData>,
      onChange?: (prev: TicketData) => TicketData
    ) => {
      queryClient.setQueryData<InfiniteData<TicketsWithCursor>>(
        ["tickets", closed, search],
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              tickets: page.tickets.map((ticket) => {
                if (ticket.id === id) {
                  if (onChange) return onChange(ticket)
                  if (data) return { ...ticket, ...data }
                }

                return ticket
              })
            }))
          }
        }
      )
    },
    [queryClient, closed, search]
  )

  const closeTicket = useCallback(
    (newTicket: Ticket) => {
      queryClient.setQueryData<InfiniteData<TicketsWithCursor>>(
        ["tickets", !newTicket.closed, search],
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              tickets: page.tickets.filter(
                (ticket) => ticket.id !== newTicket.id
              ) // Remove ticket
            }))
          }
        }
      )

      queryClient.setQueryData<InfiniteData<TicketsWithCursor>>(
        ["tickets", !!newTicket.closed, search],
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            pages: prev.pages.map((page, index) => ({
              ...page,
              tickets:
                index === 0
                  ? [{ ...newTicket, unseenMessages: 0 }, ...page.tickets]
                  : page.tickets
            }))
          }
        }
      )
    },
    [queryClient, search]
  )

  return { ...query, data: formattedData, addTicket, updateTicket, closeTicket }
}

export type TicketsWithCursor = {
  nextCursor?: string | null
  tickets: (Ticket & { unseenMessages: number })[]
}
