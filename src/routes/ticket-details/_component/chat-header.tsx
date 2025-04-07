import { Link } from "react-router"
import { formatDate } from "date-fns"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserInitials } from "@/lib/utils"
import { useTicketQuery } from "@/queries/use-ticket-query"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useTicketsQuery } from "@/queries/use-tickets-query"

import type { Ticket } from "@/types/db"
import { handleError } from "@/lib/error"

export function ChatHeader() {
  const { ticket, updateTicket } = useTicketQuery(false)
  const { closeTicket } = useTicketsQuery(false)

  const { mutate: close, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await api.patch<Ticket>(`/admin/tickets/${ticket.id}`)
      return data
    },
    onSuccess: (newTicket) => {
      toast.success(newTicket.closed ? "Ticket Closed" : "Ticket Reopened")
      updateTicket(newTicket)
      closeTicket(newTicket)
    },
    onError: handleError
  })

  return (
    <header className="flex shrink-0 items-center justify-between gap-4 border-b p-4">
      <div className="flex items-center gap-2">
        <Button
          asChild
          aria-label="Back"
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 rounded-full"
        >
          <Link to="/tickets">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <Avatar>
          <AvatarFallback className="bg-muted-foreground/20">
            {getUserInitials(ticket.user)}
          </AvatarFallback>
        </Avatar>

        <div className="flex w-full flex-col">
          <span className="line-clamp-1 break-all text-[15px] font-medium">
            {ticket.topic}
          </span>
          <span className="text-[13px] text-muted-foreground">
            {ticket.user.email}
          </span>
        </div>
      </div>

      <div className="flex cursor-pointer items-center gap-2">
        <Label
          htmlFor={"close-ticket"}
          className="whitespace-nowrap"
          title={
            ticket.closed ? `${formatDate(ticket.closed, "PP - p")}` : undefined
          }
        >
          {ticket.closed ? "Ticket Closed" : "Close Ticket"}
        </Label>
        <Switch
          id={"close-ticket"}
          disabled={isPending}
          checked={!!ticket.closed}
          onCheckedChange={() => close()}
        />
      </div>
    </header>
  )
}
