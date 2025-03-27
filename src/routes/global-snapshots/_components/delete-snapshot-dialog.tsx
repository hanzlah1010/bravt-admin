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

import type { VultrSnapshot } from "@/types/vultr"
import type { GlobalSnapshot } from "@/types/db"

type DeleteSnapshotDialogProps = {
  open: boolean
  onOpenChange: () => void
  snapshot?: VultrSnapshot
}

export default function DeleteSnapshotDialog({
  snapshot,
  open,
  onOpenChange
}: DeleteSnapshotDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteSnapshot } = useMutation({
    mutationFn: async () => {
      if (!snapshot) throw "No snapshot to delete"
      await api.delete(`/admin/global-snapshot/${snapshot?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<(VultrSnapshot & GlobalSnapshot)[]>(
        ["global-snapshots"],
        (prev) => {
          if (!prev) return prev
          return prev.filter((s) => s.id !== snapshot?.id)
        }
      )

      toast.success("Snapshot Deleted!")
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
            Snapshot{" "}
            <span className="font-medium text-foreground">
              {snapshot?.description}
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
              onClick={() => deleteSnapshot()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
