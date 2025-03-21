import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { GLOBAL_SNAPSHOT_TYPE } from "@/types/db"
import { toSentenceCase } from "@/lib/utils"
import { handleError } from "@/lib/error"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createGlobalSnapshotSchema } from "@/lib/validations/snapshot"
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import type { CreateGlobalSnapshotSchema } from "@/lib/validations/snapshot"

export default function CreateGlobalSnapshotDialog() {
  const queryClient = useQueryClient()
  const { open, onOpenChange } = useCreateGlobalSnapshotModal()

  const form = useForm<CreateGlobalSnapshotSchema>({
    resolver: zodResolver(createGlobalSnapshotSchema),
    defaultValues: {
      url: "",
      description: ""
    }
  })

  const { mutate: create, isPending } = useMutation({
    mutationFn: async (values: CreateGlobalSnapshotSchema) => {
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

            <FormField
              control={form.control}
              name="type"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select snapshot type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(GLOBAL_SNAPSHOT_TYPE).map((item) => (
                        <SelectItem key={item} value={item}>
                          {toSentenceCase(item.toLowerCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

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
