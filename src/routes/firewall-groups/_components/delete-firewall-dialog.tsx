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

import type { VultrFirewallGroup } from "@/types/vultr"
import type { Resource } from "@/types/db"

type DeleteFirewallDialogProps = {
  open: boolean
  onOpenChange: () => void
  firewall?: VultrFirewallGroup
}

export default function DeleteFirewallDialog({
  firewall,
  open,
  onOpenChange
}: DeleteFirewallDialogProps) {
  const queryClient = useQueryClient()

  const { isPending, mutate: deleteFirewall } = useMutation({
    mutationFn: async () => {
      if (!firewall) throw "No firewall group to delete"
      await api.delete(`/firewall/${firewall?.id}`)
    },
    onSuccess: () => {
      queryClient.setQueryData<(VultrFirewallGroup & Resource)[]>(
        ["firewall-groups"],
        (prev) => {
          if (!prev) return prev
          return prev.filter((f) => f.id !== firewall?.id)
        }
      )

      toast.success("Firewall Group Deleted!")
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
            Firewall group{" "}
            <span className="font-medium text-foreground">
              {firewall?.description}
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
              onClick={() => deleteFirewall()}
            >
              Delete
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
