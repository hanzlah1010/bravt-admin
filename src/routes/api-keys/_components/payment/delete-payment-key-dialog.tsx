import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { toSentenceCase } from "@/lib/utils"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction
} from "@/components/ui/alert-dialog"

import type { PaymentKey } from "@/types/db"

type DeletePaymentKeyDialogProps = {
  open: boolean
  onOpenChange: () => void
  paymentKey: PaymentKey
}

export default function DeletePaymentKeyDialog({
  paymentKey,
  open,
  onOpenChange
}: DeletePaymentKeyDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deletePaymentKey } = useMutation({
    mutationFn: async () => {
      if (!paymentKey) throw "No key to delete"
      await api.delete(`/admin/api-keys/payment/${paymentKey?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<PaymentKey[]>(["payment-keys"], (prev) => {
        if (!prev) return prev
        return prev.filter((key) => key.id !== paymentKey?.id)
      })

      toast.success("Payment Key Deleted!")
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Payment keys for{" "}
            <span className="font-medium text-foreground">
              {toSentenceCase(paymentKey?.type.toLowerCase())}
            </span>{" "}
            will be permanently deleted! This action can&apos;t be undone!
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
              onClick={() => deletePaymentKey()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
