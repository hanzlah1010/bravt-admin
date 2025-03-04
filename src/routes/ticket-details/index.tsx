import { useParams } from "react-router"
import { AlertTriangle, RefreshCw } from "lucide-react"

import { useTicketQuery } from "@/queries/use-ticket-query"
import { ChatHeader } from "./_component/chat-header"
import { ComposeTicketForm } from "./_component/compose-ticket-form"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { TicketMessages } from "./_component/ticket-messages"

export default function TicketDetails() {
  const { ticketId } = useParams()
  const { ticket, status, refetch } = useTicketQuery()

  if (status === "pending") {
    return (
      <div className="flex size-full flex-1 items-center justify-center overflow-hidden text-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!ticket || status === "error") {
    return (
      <div className="flex size-full flex-1 flex-col items-center justify-center gap-1 space-y-2 overflow-hidden text-center">
        <AlertTriangle />
        <p className="text-sm text-muted-foreground">
          Failed to fetch ticket! Please try again
        </p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="flex size-full flex-1 flex-col overflow-hidden">
      <ChatHeader />
      <TicketMessages key={ticketId} />
      <ComposeTicketForm />
    </div>
  )
}
