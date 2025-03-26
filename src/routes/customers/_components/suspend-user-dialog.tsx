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

import type { User } from "@/types/db"

type SuspendUserDialogProps = {
  open: boolean
  onOpenChange: () => void
  user?: User
}

export default function SuspendUserDialog({
  user,
  open,
  onOpenChange
}: SuspendUserDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: toggleUserSuspension } = useMutation({
    mutationFn: async () => {
      if (!user) throw "No user"
      await api.post(`/admin/user/suspend/${user.id}`)
    },
    onSuccess: () => {
      toast.success(user?.suspended ? "User unsuspended" : "User suspended")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {user?.suspended ? "Confirm Unsuspension" : "Confirm Suspension"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {user?.suspended ? "unsuspend" : "suspend"}{" "}
            <span className="font-medium text-foreground">{user?.email}</span>?
            This action will{" "}
            {user?.suspended
              ? "restore their access"
              : "stop all instances immediately"}
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
              variant={user?.suspended ? "default" : "destructive"}
              onClick={() => toggleUserSuspension()}
            >
              {user?.suspended ? "Unsuspend User" : "Suspend User"}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
