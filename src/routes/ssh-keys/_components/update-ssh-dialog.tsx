import { useEffect } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { updateSSHKeySchema } from "@/lib/validations/ssh"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

import type { VultrSSHKey } from "@/types/vultr"
import type { Resource } from "@/types/db"
import type { UpdateSSHKeySchema } from "@/lib/validations/ssh"

type UpdateSSHKeyDialogProps = {
  open: boolean
  onOpenChange: () => void
  sshKey?: VultrSSHKey & Resource
}

export default function UpdateSSHKeyDialog({
  open,
  onOpenChange,
  sshKey
}: UpdateSSHKeyDialogProps) {
  const queryClient = useQueryClient()

  const defaultValues = sshKey
    ? {
        name: sshKey?.name,
        key: sshKey?.ssh_key
      }
    : {}

  const form = useForm<UpdateSSHKeySchema>({
    resolver: zodResolver(updateSSHKeySchema),
    defaultValues
  })

  const { isPending, mutate: updateSSHKey } = useMutation({
    mutationFn: async (values: UpdateSSHKeySchema) => {
      if (!sshKey) return null
      await api.patch(`/ssh/${sshKey.id}`, values)
    },
    onSuccess: () => {
      onOpenChange()
      toast.success("SSH Key updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["ssh-keys"] })
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updateSSHKey(values))

  useEffect(() => {
    if (sshKey) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sshKey, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update SSH Key</DialogTitle>
          <DialogDescription>
            Update ssh key <span className="font-medium">{sshKey?.name}</span>!
            This will also affect changes on key owner!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3.5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="SSH Key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSH Key</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-24"
                      placeholder="ssh-rsa AAAA... you@example.com"
                      {...field}
                    />
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
