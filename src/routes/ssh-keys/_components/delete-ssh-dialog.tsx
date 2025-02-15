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

import type { VultrSSHKey } from "@/types/vultr"
import type { Resource } from "@/types/db"

type DeleteSSHKeyDialogProps = {
  open: boolean
  onOpenChange: () => void
  sshKey?: VultrSSHKey
}

export default function DeleteSSHKeyDialog({
  sshKey,
  open,
  onOpenChange
}: DeleteSSHKeyDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteSSHKey } = useMutation({
    mutationFn: async () => {
      if (!sshKey) throw "No ssh key to delete"
      await api.delete(`/ssh/${sshKey?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<(VultrSSHKey & Resource)[]>(
        ["ssh-keys"],
        (prev) => {
          if (!prev) return prev
          return prev.filter((key) => key.id !== sshKey?.id)
        }
      )

      toast.success("SSH Key Deleted!")
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  if (!sshKey) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            SSH Key{" "}
            <span className="font-medium text-foreground">{sshKey?.name}</span>{" "}
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
              onClick={() => deleteSSHKey()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
