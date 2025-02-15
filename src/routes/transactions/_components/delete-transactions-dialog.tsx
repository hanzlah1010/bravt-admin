import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { useControllableState } from "@/hooks/use-controllable-state"
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import type { Transaction } from "@/types/db"

type DeleteTransactionsDialogProps = {
  open?: boolean
  onOpenChange?: () => void
  transactions?: Transaction[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export default function DeleteTransactionsDialog({
  transactions,
  onSuccess,
  showTrigger = false,
  ...props
}: DeleteTransactionsDialogProps) {
  const [open, onOpenChange] = useControllableState({
    prop: props.open,
    onChange: props.onOpenChange
  })

  const queryClient = useQueryClient()

  const { isPending, mutate: deleteTransactions } = useMutation({
    mutationFn: async () => {
      if (!transactions || !transactions.length)
        throw "No transactions to delete"
      await api.delete("/admin/transactions", {
        data: { ids: transactions.map(({ id }) => id) }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      toast.success(
        `${transactions?.length} ${transactions?.length === 1 ? "transaction" : "transactions"} deleted!`
      )

      onSuccess?.()
    },
    onError: handleError,
    onSettled: () => onOpenChange(false)
  })

  if (!transactions?.length) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Delete ({transactions.length})
          </Button>
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {transactions.length}{" "}
              {transactions.length === 1 ? "transaction" : "transactions"}
            </span>{" "}
            will be deleted permanently! This action can&apos;t be undone!
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
              onClick={() => deleteTransactions()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
