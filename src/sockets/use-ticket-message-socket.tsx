import { useEffect } from "react"
import { toast } from "sonner"
import { useLocation, useNavigate } from "react-router"

import { USER_ROLE } from "@/types/db"
import { Button } from "@/components/ui/button"
import { useSocket } from "@/providers/socket-provider"
import { useTicketsQuery } from "@/queries/use-tickets-query"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"

import type { Ticket, TicketMessage } from "@/types/db"

export function useTicketMessageSocket() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const { addMessage, deleteMessage } = useTicketMessagesQuery(false)
  const { updateTicket } = useTicketsQuery(false)
  const { pathname } = useLocation()

  useEffect(() => {
    if (!socket) return

    const onMessageCreate = (message: TicketMessage) => {
      addMessage(message)
      updateTicket(message.ticketId, { lastMessageAt: message.createdAt })
      const path = `/tickets/${message.ticketId}`

      if (pathname !== `/tickets/${message.ticketId}`) {
        if (message.sender.role !== USER_ROLE.ADMIN) {
          updateTicket(message.ticketId, undefined, (prev) => ({
            ...prev,
            unseenMessages: prev.unseenMessages + 1
          }))
        }

        toast.info(
          `${message.sender.firstName ?? message.sender.email} sent a message`,
          {
            id: message.id,
            description: (
              <p className="line-clamp-1 break-all">{message.message}</p>
            ),
            action: (
              <Button
                size="sm"
                className="ml-auto h-6 px-2 text-xs"
                onClick={() => {
                  navigate(path)
                  updateTicket(message.ticketId, { unseenMessages: 0 })
                  toast.dismiss(message.id)
                }}
              >
                View
              </Button>
            )
          }
        )
      }
    }

    const onMessageDelete = (data: { id: string; ticket: Ticket }) => {
      deleteMessage(data)
      updateTicket(data.ticket.id, data.ticket)
    }

    socket.on("message:create", onMessageCreate)
    socket.on("message:delete", onMessageDelete)

    return () => {
      socket.off("message:create", onMessageCreate)
      socket.off("message:delete", onMessageDelete)
    }
  }, [socket, addMessage, deleteMessage, updateTicket, pathname, navigate])
}
