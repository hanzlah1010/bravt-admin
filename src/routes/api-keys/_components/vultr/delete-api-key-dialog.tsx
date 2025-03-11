import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { useActiveAPIKey } from "@/hooks/use-active-api-key"
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

import type { ApiKeys } from "@/types/db"

type DeleteAPIKeyDialogProps = {
  open: boolean
  onOpenChange: () => void
  apiKey: ApiKeys
}

export default function DeleteAPIKeyDialog({
  apiKey,
  open,
  onOpenChange
}: DeleteAPIKeyDialogProps) {
  const queryClient = useQueryClient()
  const { activeKey, removeKeyId } = useActiveAPIKey()

  const { isPending, mutate: deleteAPIKey } = useMutation({
    mutationFn: async () => {
      if (!apiKey) throw "No api key to delete"
      await api.delete(`/admin/api-keys/${apiKey?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<ApiKeys[]>(["api-keys"], (prev) => {
        if (!prev) return prev
        return prev.filter((key) => key.id !== apiKey?.id)
      })

      if (apiKey.id === activeKey?.id) {
        removeKeyId()
      }

      toast.success("API Key Deleted!")
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
            API Key{" "}
            <span className="font-medium text-foreground">{apiKey?.name}</span>{" "}
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
              onClick={() => deleteAPIKey()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
