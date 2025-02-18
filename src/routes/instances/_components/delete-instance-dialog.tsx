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

import type { VultrInstance } from "@/types/vultr"
import type { Resource } from "@/types/db"

type DeleteInstanceDialogProps = {
  open: boolean
  onOpenChange: () => void
  instance?: VultrInstance
}

export default function DeleteInstanceDialog({
  instance,
  open,
  onOpenChange
}: DeleteInstanceDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteInstance } = useMutation({
    mutationFn: async () => {
      if (!instance) throw "No instance to delete"
      await api.delete(`/instance/${instance?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<(VultrInstance & Resource)[]>(
        ["instances"],
        (prev) => {
          if (!prev) return prev
          return prev.filter((i) => i.id !== instance?.id)
        }
      )

      toast.success("Instance Deleted!")
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
            Instance{" "}
            <span className="font-medium text-foreground">
              {instance?.label}
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
              onClick={() => deleteInstance()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
