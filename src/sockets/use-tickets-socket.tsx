import { useEffect } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router"

import { Button } from "@/components/ui/button"
import { useSocket } from "@/providers/socket-provider"
import { useTicketsQuery } from "@/queries/use-tickets-query"
import { useTicketQuery } from "@/queries/use-ticket-query"

import type { Ticket } from "@/types/db"

export function useTicketsSocket() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const { addTicket, closeTicket } = useTicketsQuery(false)
  const { updateTicket } = useTicketQuery(false)

  useEffect(() => {
    if (!socket) return

    const onTicketCreate = (ticket: Ticket) => {
      addTicket(ticket)
      toast.info(
        `${ticket.user.firstName ?? ticket.user.email} opened a ticket`,
        {
          id: ticket.id,
          action: (
            <Button
              size="sm"
              className="ml-auto h-6 px-2 text-xs"
              onClick={() => {
                navigate(`/tickets/${ticket.id}`)
                toast.dismiss(ticket.id)
              }}
            >
              View
            </Button>
          )
        }
      )
    }

    const onTicketClose = (ticket: Ticket) => {
      closeTicket(ticket)
      updateTicket(ticket)
    }

    socket.on("ticket:create", onTicketCreate)
    socket.on("ticket:close", onTicketClose)

    return () => {
      socket.off("ticket:create", onTicketCreate)
      socket.off("ticket:close", onTicketClose)
    }
  }, [socket, navigate, addTicket, closeTicket, updateTicket])
}
