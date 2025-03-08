import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createGlobalSnapshotDialog } from "@/lib/validations/snapshot"
import { useCreateGlobalSnapshotModal } from "@/hooks/use-create-global-snapshot-modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import type { CreateGlobalSnapshotDialog } from "@/lib/validations/snapshot"

export default function CreateGlobalSnapshotDialog() {
  const queryClient = useQueryClient()
  const { open, onOpenChange } = useCreateGlobalSnapshotModal()

  const form = useForm<CreateGlobalSnapshotDialog>({
    resolver: zodResolver(createGlobalSnapshotDialog),
    defaultValues: {
      url: "",
      description: ""
    }
  })

  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: CreateGlobalSnapshotDialog) => {
      await api.post("/admin/global-snapshot", values)
    },
    onSuccess: () => {
      onOpenChange(false)
      queryClient.invalidateQueries({ queryKey: ["global-snapshots"] })
      toast.success("Global snapshot created!")
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => create(values))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create global snapshot</DialogTitle>
          <DialogDescription>
            This will be shown to all users while deploying instance
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3">
            <FormField
              control={form.control}
              name="url"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      placeholder="https://snapshot.bravtcloud.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" loading={isPending}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
