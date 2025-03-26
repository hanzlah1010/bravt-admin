import * as React from "react"
import TextareaAutosize from "react-textarea-autosize"
import { toast } from "sonner"
import { PaperclipIcon, SendHorizontalIcon, XIcon } from "lucide-react"
import { useParams } from "react-router"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { Label } from "@/components/ui/label"
import { Button, buttonVariants } from "@/components/ui/button"
import { getErrorMessage } from "@/lib/error"
import { useTicketQuery } from "@/queries/use-ticket-query"
import { useTicketsQuery } from "@/queries/use-tickets-query"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"
import { useFilesSelect } from "@/hooks/use-files-select"

import type { TicketMessage } from "@/types/db"
import { cn } from "@/lib/utils"

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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [message, setMessage] = React.useState("")

  const { ticketId } = useParams()
  const { updateTicket } = useTicketsQuery(false)
  const { addMessage } = useTicketMessagesQuery(false)

  const queryClient = useQueryClient()

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async () => {
      const formData = new FormData()
      formData.set("message", message)
      files.forEach((file) => formData.append("images", file))
      const { data } = await api.post<TicketMessage>(
        `/tickets/message/${ticketId}`,
        formData
      )
      return data
    },
    onSuccess: (message) => {
      setMessage("")
      addMessage(message)
      updateTicket(message.ticketId, { lastMessageAt: message.createdAt })
      if (files.length) {
        queryClient.invalidateQueries({ queryKey: ["upload-size"] })
      }

      setTimeout(() => setFiles([]), 0)
    },
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => setTimeout(() => textareaRef.current?.focus(), 50)
  })

  const { files, setFiles, removeFile, getRootProps, getInputProps } =
    useFilesSelect(isPending, textareaRef)

  const handleSubmit = React.useCallback(
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

  const handleKeyDown = React.useCallback(
    (evt: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((evt.metaKey || evt.ctrlKey) && evt.key === "Enter") {
        evt.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  React.useEffect(() => {
    textareaRef.current?.focus()
  }, [ticketId])

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("w-full shrink-0 border-t p-4", { "pt-0": !!files.length })}
    >
      {files.length > 0 && (
        <div className="flex items-center space-x-4 overflow-x-auto pb-3 pt-4">
          {files.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className={cn("group relative size-32", {
                "opacity-80": isPending
              })}
            >
              <img
                src={file.preview}
                alt={file.name}
                className="aspect-square size-full rounded-lg bg-muted object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={removeFile(idx)}
                disabled={isPending}
                className="absolute -right-1.5 -top-1.5 z-10 size-5 rounded-full opacity-0 disabled:opacity-0 group-hover:opacity-100"
              >
                <XIcon />
              </Button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          {...getRootProps()}
          className={cn(
            buttonVariants({ size: "icon", variant: "secondary" }),
            "size-10 shrink-0 cursor-pointer [&_svg]:size-[18px]",
            isPending && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <PaperclipIcon />
        </div>

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
          type="submit"
          size="icon"
          aria-label="Send Ticket"
          className="size-10 shrink-0 rounded-full [&_svg]:size-[18px]"
          loading={isPending}
        >
          <SendHorizontalIcon />
        </Button>
      </div>
    </form>
  )
}
