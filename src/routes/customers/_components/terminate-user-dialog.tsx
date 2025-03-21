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

type TerminateUserDialogProps = {
  open: boolean
  onOpenChange: () => void
  user?: User
}

export default function TerminateUserDialog({
  user,
  open,
  onOpenChange
}: TerminateUserDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: terminateUser } = useMutation({
    mutationFn: async () => {
      if (!user) throw "No user"
      await api.post(`/admin/user/terminate/${user.id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("User terminated!")
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
            User{" "}
            <span className="font-medium text-foreground">{user?.email}</span>{" "}
            will be terminated & all data related to this user will be deleted
            permanently! This action can&apos;t be undone!
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
              onClick={() => terminateUser()}
            >
              Terminate
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
