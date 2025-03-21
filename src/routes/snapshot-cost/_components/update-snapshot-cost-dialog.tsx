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
import { updateSnapshotCostSchema } from "@/lib/validations/snapshot"
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

import type { UpdateSnapshotCostSchema } from "@/lib/validations/snapshot"

type UpdateSnapshotCostDialogProps = {
  prevCost?: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateSnapshotCostDialog({
  prevCost,
  open,
  onOpenChange
}: UpdateSnapshotCostDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<UpdateSnapshotCostSchema>({
    resolver: zodResolver(updateSnapshotCostSchema),
    defaultValues: {
      cost: prevCost
    }
  })

  const { isPending, mutate: updateCost } = useMutation({
    mutationFn: async (values: UpdateSnapshotCostSchema) => {
      await api.post("/admin/plan/snapshot", values)
    },
    onSuccess: (_, variables) => {
      toast.success("Snapshot cost updated!")
      handleOpenChange(false)
      queryClient.setQueryData(["snapshot-cost"], () => variables.cost)
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => updateCost(values))

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    setTimeout(() => form.reset(), 300)
  }

  useEffect(() => {
    if (prevCost !== undefined) form.reset({ cost: prevCost })
  }, [prevCost, form])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogTitle>Snapshot cost</DialogTitle>
        <DialogDescription>
          This will reflect changes to all running & future snapshots
        </DialogDescription>

        <Form {...form}>
          <form className="space-y-3" onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="cost"
              disabled={isPending}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cost</FormLabel>
                  <FormControl>
                    <NumberInput placeholder="0.028" prefix="$ " {...field} />
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
