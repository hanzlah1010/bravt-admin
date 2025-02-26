import { useMemo } from "react"
import { useParams } from "react-router"
import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { TicketMessage } from "@/types/db"

export function useTicketMessagesQuery() {
  const { ticketId } = useParams()

  const { data, ...query } = useInfiniteQuery({
    queryKey: ["ticket-messages", ticketId],
    placeholderData: keepPreviousData,
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

  return { ...query, data: formattedData }
}

export type MessagesWithCursor = {
  nextCursor?: string | null
  messages: TicketMessage[]
}
