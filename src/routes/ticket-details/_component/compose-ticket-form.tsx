import TextareaAutosize from "react-textarea-autosize"
import { useCallback, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { SendHorizontalIcon } from "lucide-react"
import { useParams } from "react-router"
import { useMutation } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/error"
import { useTicketQuery } from "@/queries/use-ticket-query"
import { useTicketsQuery } from "@/queries/use-tickets-query"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"

import type { TicketMessage } from "@/types/db"

export function ComposeTicketForm() {
  const { ticket } = useTicketQuery()

  if (ticket.closed) {
    return (
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
    )
  }

  return <Form />
}

function Form() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = useState("")

  const { ticketId } = useParams()
  const { updateTicket } = useTicketsQuery(false)
  const { addMessage } = useTicketMessagesQuery(false)

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<TicketMessage>(
        `/tickets/message/${ticketId}`,
        { message }
      )
      return data
    },
    onSuccess: (message) => {
      setMessage("")
      addMessage(message)
      updateTicket(message.ticketId, { lastMessageAt: message.createdAt })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => setTimeout(() => textareaRef.current?.focus(), 50)
  })

  const handleSubmit = useCallback(
    (evt?: React.FormEvent<HTMLFormElement>) => {
      evt?.preventDefault()
      if (!message.trim()) {
        textareaRef.current?.focus()
        return
      }

      sendMessage()
    },
    [sendMessage, message]
  )

  const handleKeyDown = useCallback(
    (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((evt.metaKey || evt.ctrlKey) && evt.key === "Enter") {
        evt.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  useEffect(() => {
    textareaRef.current?.focus()
  }, [ticketId])

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full shrink-0 gap-2 border-t p-4"
    >
      <TextareaAutosize
        disabled={isPending}
        value={message}
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message..."
        className="flex max-h-[120px] min-h-10 w-full resize-none rounded-md border-2 border-input bg-card px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      />
      <Button
        size="icon"
        aria-label="Send Ticket"
        className="size-10 shrink-0 [&_svg]:size-[18px]"
        loading={isPending}
      >
        <SendHorizontalIcon />
      </Button>
    </form>
  )
}
