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

import type { Notification } from "@/types/db"

type DeleteNotificationsDialogProps = {
  open?: boolean
  onOpenChange?: () => void
  notifications?: Notification[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export default function DeleteNotificationsDialog({
  notifications,
  onSuccess,
  showTrigger = false,
  ...props
}: DeleteNotificationsDialogProps) {
  const [open, onOpenChange] = useControllableState({
    prop: props.open,
    onChange: props.onOpenChange
  })

  const queryClient = useQueryClient()

  const { isPending, mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      if (!notifications || !notifications.length)
        throw "No notifications to delete"
      await api.delete("/admin/notifications", {
        data: { ids: notifications.map(({ id }) => id) }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      toast.success(
        `${notifications?.length} ${notifications?.length === 1 ? "notification" : "notifications"} deleted!`
      )

      onSuccess?.()
    },
    onError: handleError,
    onSettled: () => onOpenChange(false)
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Delete ({notifications?.length})
          </Button>
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-medium text-foreground">
              {notifications?.length}{" "}
              {notifications?.length === 1 ? "notification" : "notifications"}
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
              onClick={() => deleteNotifications()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
