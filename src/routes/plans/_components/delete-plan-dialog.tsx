import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
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

import type { TablePlan } from "@/queries/use-plans"

type DeletePlanDialogProps = {
  open: boolean
  onOpenChange: () => void
  plan?: TablePlan
}

export default function DeletePlanDialog({
  plan,
  open,
  onOpenChange
}: DeletePlanDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deletePlan } = useMutation({
    mutationFn: async () => {
      if (!plan) return
      await api.delete(`/plan/${plan?.id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      toast.success("Plan Deleted!")
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  if (!plan) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            The{" "}
            <span className="font-medium text-foreground">{plan?.plan}</span>{" "}
            plan will be permanently deleted, and payments will stop for
            associated instances.
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
              onClick={() => deletePlan()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
