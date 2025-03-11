import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { PAYMENT_METHOD } from "@/types/db"
import { toSentenceCase } from "@/lib/utils"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { PasswordInput } from "@/components/ui/password-input"
import { createPaymentKeySchema } from "@/lib/validations/api-key"
import { useCreateAPIKeyModal } from "@/hooks/use-create-api-key-modal"
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

import type { ApiKeys } from "@/types/db"
import type { CreatePaymentKeySchema } from "@/lib/validations/api-key"

export default function CreatePaymentKeyDialog() {
  const queryClient = useQueryClient()
  const { open, onOpenChange, modalType } = useCreateAPIKeyModal()

  const form = useForm<CreatePaymentKeySchema>({
    resolver: zodResolver(createPaymentKeySchema),
    defaultValues: {
      clientId: "",
      clientSecret: "",
      webhookId: ""
    }
  })

  const { isPending, mutate: create } = useMutation({
    mutationFn: async (values: CreatePaymentKeySchema) => {
      await api.post<ApiKeys>("/admin/api-keys/payment", values)
    },
    onSuccess: () => {
      handleOpenChange(false)
      toast.success("Payment Key created")
      queryClient.invalidateQueries({ queryKey: ["payment-keys"] })
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
      open={open && modalType === "PAYMENT"}
      onOpenChange={handleOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payment Key</DialogTitle>
          <DialogDescription>
            Helps to receive payments on platform & sync states with webhooks
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Please select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(PAYMENT_METHOD).map((item) => (
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

            <FormField
              control={form.control}
              name="clientId"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Id</FormLabel>
                  <FormControl>
                    <PasswordInput autoFocus {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="clientSecret"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Secret</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="webhookId"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Webhook Id</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
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
