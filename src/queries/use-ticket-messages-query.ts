import { useCallback, useMemo } from "react"
import { useParams } from "react-router"
import {
  keepPreviousData,
  useInfiniteQuery,
  useQueryClient
} from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useSocket } from "@/providers/socket-provider"

import type { Ticket, TicketMessage } from "@/types/db"
import type { InfiniteData } from "@tanstack/react-query"

export function useTicketMessagesQuery(enabled = true) {
  const { ticketId } = useParams()
  const queryClient = useQueryClient()
  const { isConnected } = useSocket()

  const { data, ...query } = useInfiniteQuery({
    enabled,
    queryKey: ["ticket-messages", ticketId],
    placeholderData: keepPreviousData,
    refetchInterval: isConnected ? undefined : 1000,
    queryFn: async ({ pageParam }) => {
      const { data } = await api.get<MessagesWithCursor>(
        `/tickets/${ticketId}/messages/?cursor=${pageParam || ""}`
      )
      return data
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })

  const formattedData = useMemo(
    () => data?.pages.flatMap((page) => page.messages).reverse() || [],
    [data]
  )

  const addMessage = useCallback(
    (message: TicketMessage) => {
      queryClient.setQueryData<InfiniteData<MessagesWithCursor>>(
        ["ticket-messages", message.ticketId],
        (prev) => {
          if (!prev) return { pages: [{ messages: [message] }], pageParams: [] }
          return {
            ...prev,
            pages: prev.pages.map((page, index) => ({
              ...page,
              messages:
                index === 0 ? [message, ...page.messages] : page.messages
            }))
          }
        }
      )
    },
    [queryClient]
  )

  const deleteMessage = useCallback(
    ({ id, ticket }: { id: string; ticket: Ticket }) => {
      queryClient.setQueryData<InfiniteData<MessagesWithCursor>>(
        ["ticket-messages", ticket.id],
        (prev) => {
          if (!prev) return prev
          return {
            ...prev,
            pages: prev.pages.map((page) => ({
              ...page,
              messages: page.messages.filter((msg) => msg.id !== id)
            }))
          }
        }
      )
    },
    [queryClient]
  )

  return {
    ...query,
    rawData: data,
    data: formattedData,
    addMessage,
    deleteMessage
  }
}

export type MessagesWithCursor = {
  nextCursor?: string | null
  messages: TicketMessage[]
}
