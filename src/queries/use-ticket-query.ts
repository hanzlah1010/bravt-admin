import { api } from "@/lib/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import type { Ticket } from "@/types/db"

export function useTicketQuery() {
  const { ticketId } = useParams()
  const { data, ...query } = useQuery({
    queryKey: ["ticket", ticketId],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<Ticket>(`/tickets/${ticketId}`)
      return data
    }
  })

  return { ticket: data as Ticket, ...query }
}
