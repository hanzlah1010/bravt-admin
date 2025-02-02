import { z } from "zod"

import { decimalSchema } from "./_utils"

export const createPlanSchema = z.object({
  plan: z
    .string({ required_error: "Please select a plan" })
    .min(1, "Please select a plan"),
  hourlyCost: z
    .number({ required_error: "Instance cost is required" })
    .min(0, "Cost must be positive")
    .refine(...decimalSchema()),
  backupCost: z
    .number({ required_error: "Backup cost is required" })
    .min(0, "Cost must be positive")
    .refine(...decimalSchema())
})

export type CreatePlanSchema = z.infer<typeof createPlanSchema>

export const updatePlanSchema = createPlanSchema.omit({ plan: true })
export type UpdatePlanSchema = z.infer<typeof updatePlanSchema>
