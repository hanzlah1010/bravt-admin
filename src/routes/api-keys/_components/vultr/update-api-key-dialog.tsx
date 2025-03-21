import { useEffect } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/lib/api"
import { Switch } from "@/components/ui/switch"
import { handleError } from "@/lib/error"
import { apiKeySchema } from "@/lib/validations/api-key"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useActiveAPIKey } from "@/hooks/use-active-api-key"
import { PasswordInput } from "@/components/ui/password-input"
import { NumberInput } from "@/components/ui/number-input"
import {
  Form,
  FormControl,
  FormDescription,
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

import type { ApiKeys } from "@/types/db"
import type { ApiKeySchema } from "@/lib/validations/api-key"

type UpdateAPIKeyDialogProps = {
  open: boolean
  onOpenChange: () => void
  apiKey: ApiKeys
}

export default function UpdateAPIKeyDialog({
  open,
  onOpenChange,
  apiKey
}: UpdateAPIKeyDialogProps) {
  const queryClient = useQueryClient()
  const { setActiveKey } = useActiveAPIKey()

  const defaultValues = apiKey
    ? {
        name: apiKey.name,
        key: apiKey.key,
        instancesLimit: apiKey.instancesLimit,
        active: apiKey.active
      }
    : {}

  const form = useForm<ApiKeySchema>({
    resolver: zodResolver(apiKeySchema),
    defaultValues
  })

  const { isPending, mutate: updateAPIKey } = useMutation({
    mutationFn: async (values: ApiKeySchema) => {
      await api.patch(`/admin/api-keys/${apiKey.id}`, values)
    },
    onSuccess: (_, { active }) => {
      onOpenChange()
      toast.success("API Key updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["api-keys"] })
      if (active) setActiveKey(apiKey.id)
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updateAPIKey(values))

  useEffect(() => {
    if (apiKey) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update API Key</DialogTitle>
          <DialogDescription>
            Update api key <span className="font-medium">{apiKey?.name}</span>!
            This will take effect on your whole platform!
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3.5">
            <FormField
              control={form.control}
              name="name"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input autoFocus placeholder="API Key" {...field} />
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
              name="instancesLimit"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instances Limit</FormLabel>
                  <FormControl>
                    <NumberInput
                      placeholder="300"
                      decimalScale={0}
                      {...field}
                    />
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
