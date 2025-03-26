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

import type { Resource } from "@/types/db"
import type { VultrInstance } from "@/types/vultr"

type SuspendInstanceDialogProps = {
  open: boolean
  onOpenChange: () => void
  instance?: Resource & VultrInstance
}

export default function SuspendInstanceDialog({
  instance,
  open,
  onOpenChange
}: SuspendInstanceDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: toggleInstanceSuspension } = useMutation({
    mutationFn: async () => {
      if (!instance) throw new Error("No instance selected")
      await api.patch(`/admin/instances/suspend/${instance.id}`)
    },
    onSuccess: () => {
      toast.success(
        instance?.suspended ? "Instance unsuspended" : "Instance suspended"
      )
      queryClient.invalidateQueries({ queryKey: ["instances"] })
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {instance?.suspended
              ? "Confirm Unsuspension"
              : "Confirm Suspension"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to{" "}
            {instance?.suspended ? "unsuspend" : "suspend"}{" "}
            {instance?.label ? (
              <span className="font-medium text-foreground">
                {instance?.label}
              </span>
            ) : (
              "this instance"
            )}
            ? This action will{" "}
            {instance?.suspended
              ? "allow it to be used again"
              : "prevent the user from using it"}
            .
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
              loading={isPending}
              variant={instance?.suspended ? "default" : "destructive"}
              onClick={() => toggleInstanceSuspension()}
            >
              {instance?.suspended ? "Unsuspend Instance" : "Suspend Instance"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
