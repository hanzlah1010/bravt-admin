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

  const formattedData = useMemo(
    () =>
      data?.pages
        .flatMap((page) => page.tickets)
        .sort(
          (a, b) =>
            new Date(b.lastMessageAt).getTime() -
            new Date(a.lastMessageAt).getTime()
        ) || [],
    [data]
  )

  const updateTicket = useCallback(
    (id: string, data: Partial<TicketsWithCursor["tickets"][number]>) => {
      queryClient.setQueryData<InfiniteData<TicketsWithCursor>>(
        ["tickets", closed, search],
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              tickets: page.tickets.map((ticket) => {
                return ticket.id === id ? { ...ticket, ...data } : ticket
              })
            }))
          }
        }
      )
    },
    [queryClient, closed, search]
  )

  return { ...query, updateTicket, data: formattedData }
}

export type TicketsWithCursor = {
  nextCursor: string | null
  tickets: (Ticket & { unseenMessages: number })[]
}
