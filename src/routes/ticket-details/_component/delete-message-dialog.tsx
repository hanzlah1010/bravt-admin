import { api } from "@/lib/api"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"
import { useTicketsQuery } from "@/queries/use-tickets-query"
import { handleError } from "@/lib/error"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

import type { Ticket } from "@/types/db"

type DeleteMessageDialogProps = {
  id: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteMessageDialog({
  id,
  ...props
}: DeleteMessageDialogProps) {
  const { deleteMessage } = useTicketMessagesQuery(false)
  const { updateTicket } = useTicketsQuery(false)

  const { isPending, mutate: deleteMsg } = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<Ticket>(`/tickets/message/${id}`)
      return data
    },
    onSuccess: (ticket) => {
      deleteMessage({ id, ticket })
      updateTicket(ticket.id, ticket)
    },
    onError: handleError
  })

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This message will be deleted permanently! This action can&apos;t be
            undone!
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              loading={isPending}
              onClick={() => deleteMsg()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
