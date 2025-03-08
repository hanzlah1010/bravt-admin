import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api, setAccessToken } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { useSessionQuery } from "@/queries/use-session-query"
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

type ImpersonateUserDialogProps = {
  open?: boolean
  onOpenChange?: () => void
  user?: User
}

export default function ImpersonateUserDialog({
  user,
  open,
  onOpenChange
}: ImpersonateUserDialogProps) {
  const queryClient = useQueryClient()
  const { user: currentUser } = useSessionQuery()

  const { isPending, mutate: impersonateUser } = useMutation({
    mutationFn: async () => {
      if (!user) throw "No user"
      const { data } = await api.post<{ token: string; user: User }>(
        `/auth/impersonate/${user.id}`
      )
      return data
    },
    onSuccess: ({ token, user }) => {
      setAccessToken(token)
      queryClient.setQueryData(["session"], (prev) => {
        if (!prev) return prev
        return { ...prev, ...user, impersonatedBy: currentUser.id }
      })
      window.open(`${import.meta.env.VITE_CONSOLE_URL}/instance`, "_blank")
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
            You will be impersonating{" "}
            <span className="text-foreground">{user?.email}</span> &
            couldn&apos;t access the admin panel
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
              variant="default"
              loading={isPending}
              onClick={() => impersonateUser()}
            >
              Impersonate
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
