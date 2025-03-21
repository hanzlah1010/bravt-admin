import { useEffect } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { updateUserSchema } from "@/lib/validations/user"
import { Button } from "@/components/ui/button"
import { NumberInput } from "@/components/ui/number-input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import type { User } from "@/types/db"
import type { UpdateUserSchema } from "@/lib/validations/user"

type UpdateUserDialogProps = {
  open: boolean
  onOpenChange: () => void
  user?: User
}

export default function UpdateUserDialog({
  open,
  onOpenChange,
  user
}: UpdateUserDialogProps) {
  const queryClient = useQueryClient()

  const defaultValues = user
    ? {
        credits: user?.credits,
        instanceCreateLimit: user?.instanceCreateLimit,
        dailyInstanceLimit: user?.dailyInstanceLimit,
        dailyDeleteLimit: user?.dailyDeleteLimit
      }
    : {}

  const form = useForm<UpdateUserSchema>({
    resolver: zodResolver(updateUserSchema),
    defaultValues
  })

  const { isPending, mutate: updateUser } = useMutation({
    mutationFn: async (values: UpdateUserSchema) => {
      if (!user) throw "No user"
      await api.patch(`/admin/user/${user.id}`, values)
    },
    onSuccess: () => {
      onOpenChange()
      toast.success("User updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updateUser(values))

  useEffect(() => {
    if (user) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>
            Update user <span className="font-medium">{user?.email}</span> &
            customize limits
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3.5">
            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Credits</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="10" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instanceCreateLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instance Limit</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="5" decimalScale={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dailyInstanceLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Create Instance Limit</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="5" decimalScale={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dailyDeleteLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Delete Instance Limit</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="5" decimalScale={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={isPending}
            >
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
