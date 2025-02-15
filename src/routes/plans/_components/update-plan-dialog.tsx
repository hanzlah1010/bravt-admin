import { useEffect } from "react"
import { toast } from "sonner"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { api } from "@/lib/api"
import { handleError } from "@/lib/error"
import { updatePlanSchema } from "@/lib/validations/plan"
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

import type { TablePlan } from "@/queries/use-plans-query"
import type { UpdatePlanSchema } from "@/lib/validations/plan"

type UpdatePlanDialogProps = {
  open: boolean
  onOpenChange: () => void
  plan?: TablePlan
}

export default function UpdatePlanDialog({
  open,
  onOpenChange,
  plan
}: UpdatePlanDialogProps) {
  const queryClient = useQueryClient()

  const defaultValues = plan
    ? {
        hourlyCost: Number(plan?.instanceCost),
        backupCost: Number(plan?.backupCost)
      }
    : {}

  const form = useForm<UpdatePlanSchema>({
    resolver: zodResolver(updatePlanSchema),
    defaultValues
  })

  const { isPending, mutate: updatePlan } = useMutation({
    mutationFn: async (values: UpdatePlanSchema) => {
      if (!plan) return null
      await api.patch(`/admin/plan/${plan.id}`, values)
    },
    onSuccess: () => {
      onOpenChange()
      toast.success("Plan updated successfully!")
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updatePlan(values))

  useEffect(() => {
    if (plan) {
      form.reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan, form])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Plan</DialogTitle>
          <DialogDescription>
            Update plan <span className="font-medium">{plan?.plan}</span> &
            customize pricing
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3.5">
            <FormField
              control={form.control}
              name="hourlyCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Instance Cost{" "}
                    <sub className="text-muted-foreground">(Per Hour)</sub>
                  </FormLabel>
                  <FormControl>
                    <NumberInput placeholder="0.014" prefix="$ " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backupCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Backup Cost{" "}
                    <sub className="text-muted-foreground">(Per Hour)</sub>
                  </FormLabel>
                  <FormControl>
                    <NumberInput placeholder="0.01" prefix="$ " {...field} />
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
