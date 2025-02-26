import { Link } from "react-router"
import {
  ArrowLeft,
  EllipsisVertical,
  LockKeyholeOpen,
  MessageSquareX,
  Trash2
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { getUserInitials } from "@/lib/utils"
import { useTicketQuery } from "@/queries/use-ticket-query"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function ChatHeader() {
  const { ticket } = useTicketQuery()

  return (
    <header className="flex shrink-0 items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <Button
          asChild
          aria-label="Back"
          variant="ghost"
          size="icon"
          className="shrink-0"
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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost" aria-label="Ticket Actions">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            {ticket.closed ? <LockKeyholeOpen /> : <MessageSquareX />}
            {ticket.closed ? "Reopen Ticket" : "Close Ticket"}
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 /> Delete Ticket
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
