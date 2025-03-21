"use client"

import { useEffect } from "react"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { NumberInput } from "@/components/ui/number-input"
import { updateAffiliateCommissionSchema } from "@/lib/validations/affiliate"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import type { UpdateAffiliateCommissionSchema } from "@/lib/validations/affiliate"

type UpdateAffiliateCommissionDialogProps = {
  prevAmount?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateAffiliateCommissionDialog({
  prevAmount,
  open,
  onOpenChange
}: UpdateAffiliateCommissionDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<UpdateAffiliateCommissionSchema>({
    resolver: zodResolver(updateAffiliateCommissionSchema),
    defaultValues: {
      amount: prevAmount
    }
  })

  const { isPending, mutate: updateCost } = useMutation({
    mutationFn: async (values: UpdateAffiliateCommissionSchema) => {
      await api.post("/admin/transactions/affiliate", values)
    },
    onSuccess: (_, variables) => {
      toast.success("Affiliate commission updated!")
      handleOpenChange(false)
      queryClient.setQueryData(["affiliate-commission"], () => variables.amount)
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updateCost(values))

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    setTimeout(() => form.reset(), 300)
  }

  useEffect(() => {
    if (prevAmount !== undefined) form.reset({ amount: prevAmount })
  }, [prevAmount, form])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>Affiliate commission</DialogTitle>
        <DialogDescription>
          This will update commission for affiliations
        </DialogDescription>

        <Form {...form}>
          <form className="space-y-3" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="amount"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="10" suffix="%" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" loading={isPending}>
              Save
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
