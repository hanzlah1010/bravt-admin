import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDownIcon } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { FixedSizeList as List } from "react-window"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"

import { cn, formatPrice } from "@/lib/utils"
import { handleError } from "@/lib/error"
import { useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlanSchema } from "@/lib/validations/plan"
import { useVultrPlansQuery } from "@/queries/use-vultr-plans-query"
import { Spinner } from "@/components/ui/spinner"
import { NumberInput } from "@/components/ui/number-input"
import { usePlanModal } from "@/hooks/use-plan-modal"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import type { CreatePlanSchema } from "@/lib/validations/plan"

export default function CreatePlanDialog() {
  const queryClient = useQueryClient()

  const { open, onOpenChange } = usePlanModal()

  const form = useForm<CreatePlanSchema>({
    resolver: zodResolver(createPlanSchema)
  })

  const { isPending, mutate: createPlan } = useMutation({
    mutationFn: async (values: CreatePlanSchema) => {
      await api.post("/admin/plan", values)
    },
    onSuccess: () => {
      handleOpenChange(false)
      toast.success("Plan created successfully!")
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
    onError: handleError
  })

  const onSubmit = form.handleSubmit((values) => createPlan(values))

  const handleOpenChange = (open: boolean) => {
    onOpenChange(open)
    setTimeout(form.reset, 300)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Plan</DialogTitle>
          <DialogDescription>
            Create plans to monetize your platform
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-3.5">
            <PlansSelect disabled={isPending} />

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
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

function PlansSelect({ disabled = false }) {
  const form = useFormContext()

  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)

  const { plans, status } = useVultrPlansQuery()

  const filteredPlans = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return plans

    return plans.filter((plan) => {
      return (
        plan.locations.some((location) => location.toLowerCase().includes(q)) ||
        plan.type.toLowerCase().includes(q) ||
        plan.id.toLowerCase().includes(q) ||
        [plan.monthly_cost, plan.hourly_cost, plan.vcpu_count, plan.ram].some(
          (v) => String(v).includes(q)
        )
      )
    })
  }, [plans, search])

  return (
    <FormField
      control={form.control}
      name="plan"
      disabled={disabled || status === "pending"}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Plan</FormLabel>

          <Popover modal open={open} onOpenChange={setOpen}>
            <FormControl>
              <PopoverTrigger
                disabled={disabled || status === "pending"}
                className={cn(
                  "flex h-10 w-full items-center justify-between rounded-md border-2 px-3 py-1 focus-visible:border-primary focus-visible:outline-none disabled:opacity-50 data-[state=open]:border-primary md:text-sm",
                  { "text-muted-foreground/50": !field.value }
                )}
              >
                {field.value ?? "Select a plan"}
                {status === "pending" ? (
                  <Spinner size="sm" className="text-muted-foreground" />
                ) : (
                  <ChevronsUpDownIcon className="size-4 text-muted-foreground" />
                )}
              </PopoverTrigger>
            </FormControl>

            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command shouldFilter={false}>
                <CommandInput
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Search plans..."
                />
                <CommandList>
                  {filteredPlans.length > 0 ? (
                    <CommandGroup>
                      <List
                        height={Math.min(filteredPlans.length * 32, 200)}
                        itemCount={filteredPlans.length}
                        itemSize={32}
                        width="100%"
                      >
                        {({ style, index }) => {
                          const item = filteredPlans[index]
                          return (
                            <CommandItem
                              key={item.id}
                              value={item.id}
                              style={style}
                              onSelect={() => {
                                field.onChange(item.id)
                                setOpen(false)
                              }}
                            >
                              {item.id}
                              <small className="text-muted-foreground">
                                ({formatPrice(item.hourly_cost)})
                              </small>
                              <Check
                                className={cn("ml-auto size-4", {
                                  "opacity-0": item.id !== field.value
                                })}
                              />
                            </CommandItem>
                          )
                        }}
                      </List>
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>
                      {status === "error"
                        ? "Failed to fetch plans."
                        : "No plan found."}
                    </CommandEmpty>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
