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

import type { VultrISO } from "@/types/vultr"
import type { Resource } from "@/types/db"

type DeleteISODialogProps = {
  open: boolean
  onOpenChange: () => void
  iso?: VultrISO
}

export default function DeleteISODialog({
  iso,
  open,
  onOpenChange
}: DeleteISODialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteISO } = useMutation({
    mutationFn: async () => {
      if (!iso) throw "No iso to delete"
      await api.delete(`/iso/${iso?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<(VultrISO & Resource)[]>(["isos"], (prev) => {
        if (!prev) return prev
        return prev.filter((i) => i.id !== iso?.id)
      })

      toast.success("ISO Deleted!")
    },
    onError: handleError,
    onSettled: onOpenChange
  })

  if (!iso) {
    return null
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            ISO{" "}
            <span className="font-medium text-foreground">{iso?.filename}</span>{" "}
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
              onClick={() => deleteISO()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
