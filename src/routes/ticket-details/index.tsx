import { useRef } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { useTicketQuery } from "@/queries/use-ticket-query"
import { ChatHeader } from "./_component/chat-header"
import { ComposeTicketForm } from "./_component/compose-ticket-form"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
// import { MessagesList } from "./_component/messages-list"
import { Label } from "@/components/ui/label"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"
import { TicketMessages } from "./_component/ticket-messages"

export default function TicketDetails() {
  const {
    ticket,
    status: ticketStatus,
    refetch: ticketRefetch
  } = useTicketQuery()

  const { status: messagesStatus, refetch: messagesRefetch } =
    useTicketMessagesQuery()

  if (ticketStatus === "pending" || messagesStatus === "pending") {
    return (
      <div className="flex size-full flex-1 items-center justify-center overflow-hidden text-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!ticket || ticketStatus === "error" || messagesStatus === "error") {
    return (
      <div className="flex size-full flex-1 flex-col items-center justify-center gap-1 space-y-2 overflow-hidden text-center">
        <AlertTriangle />
        <p className="text-sm text-muted-foreground">
          Failed to fetch ticket! Please try again
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (ticketStatus === "error") ticketRefetch()
            if (messagesStatus === "error") messagesRefetch()
          }}
        >
          <RefreshCw />
          Retry
        </Button>
      </div>
    )
  }

  return <Comp />
}

function Comp() {
  const { ticket } = useTicketQuery(false)
  const shouldStickToBottom = useRef(true)

  return (
    <div className="flex size-full flex-1 flex-col overflow-hidden">
      <ChatHeader />
      {/* <MessagesList shouldStickToBottom={shouldStickToBottom} /> */}
      <TicketMessages />
      {ticket.closed ? (
        <div className="flex min-h-[73px] shrink-0 items-center justify-center gap-1 border-t p-4 text-center text-sm">
          <div className="">
            <span className="text-muted-foreground">
              This ticket has been closed. If something went missing you can
            </span>{" "}
            <Label
              htmlFor={"close-ticket"}
              className="cursor-pointer whitespace-nowrap text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
            >
              Reopen this ticket
            </Label>
          </div>
        </div>
      ) : (
        <ComposeTicketForm shouldStickToBottom={shouldStickToBottom} />
      )}
    </div>
  )
}
