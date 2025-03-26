import { useCallback } from "react"
import { useParams } from "react-router"
import {
  keepPreviousData,
  useQuery,
  useQueryClient
} from "@tanstack/react-query"

import { api } from "@/lib/api"
import { useSocket } from "@/providers/socket-provider"

import type { Ticket } from "@/types/db"

export function useTicketQuery(enabled = true) {
  const queryClient = useQueryClient()
  const { ticketId } = useParams()
  const { isConnected } = useSocket()

  const { data, ...query } = useQuery({
    enabled,
    queryKey: ["ticket", ticketId],
    placeholderData: keepPreviousData,
    refetchInterval: isConnected ? undefined : 1000,
    queryFn: async () => {
      const { data } = await api.get<Ticket>(`/tickets/${ticketId}`)
      return data
    }
  })

  const updateTicket = useCallback(
    (newTicket: Ticket) => {
      queryClient.setQueryData<Ticket>(["ticket", newTicket.id], (prev) => {
        if (!prev) return prev
        return { ...prev, ...newTicket }
      })
    },
    [queryClient]
  )

  return { ticket: data as Ticket, updateTicket, ...query }
}
