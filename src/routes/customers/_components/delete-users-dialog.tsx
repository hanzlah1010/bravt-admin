import { toast } from "sonner"
import { Trash2Icon } from "lucide-react"
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
  AlertDialogAction,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog"

import type { User } from "@/types/db"

type DeleteUsersDialogProps = {
  open?: boolean
  onOpenChange?: () => void
  users?: User[]
  showTrigger?: boolean
  onSuccess?: () => void
}

export default function DeleteUsersDialog({
  users,
  onSuccess,
  showTrigger = false,
  open,
  onOpenChange
}: DeleteUsersDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteUsers } = useMutation({
    mutationFn: async () => {
      if (!users || !users.length) throw "No users to delete"
      await api.delete("/admin/user", {
        data: { ids: users.map(({ id }) => id) }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success(
        `${users?.length} ${users?.length === 1 ? "user" : "users"} deleted!`
      )

      onSuccess?.()
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <AlertDialogTrigger asChild>
          <Button size="sm" variant="destructive">
            <Trash2Icon aria-hidden="true" />
            Delete ({users?.length})
          </Button>
        </AlertDialogTrigger>
      ) : null}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {users && users?.length > 1 ? (
              <span className="font-medium text-foreground">
                {users?.length} users
              </span>
            ) : (
              <>
                User{" "}
                <span className="font-medium text-foreground">
                  {users?.[0].email}
                </span>
              </>
            )}{" "}
            will be deleted permanently & all data related to{" "}
            {users && users?.length > 1 ? "them" : "user"} will be lost! This
            action can&apos;t be undone!
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
              onClick={() => deleteUsers()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
