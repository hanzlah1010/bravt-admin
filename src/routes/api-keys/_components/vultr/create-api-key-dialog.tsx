import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { apiKeySchema } from "@/lib/validations/api-key"
import { useCreateAPIKeyModal } from "@/hooks/use-create-api-key-modal"
import { useActiveAPIKey } from "@/hooks/use-active-api-key"
import { PasswordInput } from "@/components/ui/password-input"
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import type { ApiKeySchema } from "@/lib/validations/api-key"
import type { ApiKeys } from "@/types/db"

export default function CreateAPIKeyDialog() {
  const queryClient = useQueryClient()
  const { open, onOpenChange, modalType } = useCreateAPIKeyModal()
  const { setActiveKey } = useActiveAPIKey()

  const form = useForm<ApiKeySchema>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: "",
      key: "",
      active: false
    }
  })

  const { isPending, mutate: create } = useMutation({
    mutationFn: async (values: ApiKeySchema) => {
      const { data } = await api.post<ApiKeys>("/admin/api-keys", values)
      return data
    },
    onSuccess: (data, { active }) => {
      handleOpenChange(false)
      toast.success("API Key created")
      queryClient.invalidateQueries({ queryKey: ["api-keys"] })
      if (active) setActiveKey(data.id)
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => create(values))

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    if (!open) setTimeout(() => form.reset(), 300)
  }

  return (
    <Dialog
      open={open && modalType === "VULTR"}
      onOpenChange={handleOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            This can be used as primary api key or fallback if anything went
            wrong
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="Bravt 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="key"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              disabled={isPending}
              render={({ field }) => (
                <FormLabel className="flex cursor-pointer items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-1.5">
                    <p className="text-sm font-medium">Active</p>
                    <FormDescription>
                      This will activate this api key & deactivate all the
                      others
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      disabled={isPending}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormLabel>
              )}
            />

            <Button className="w-full" type="submit" loading={isPending}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
