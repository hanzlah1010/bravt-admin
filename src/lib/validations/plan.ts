import { z } from "zod"

import { decimalSchema } from "./_utils"

const basePlanSchema = z.object({
  plan: z
    .string({ required_error: "Please select a plan" })
    .min(1, "Please select a plan"),
  hourlyCost: z
    .number({ required_error: "Instance cost is required" })
    .min(0, "Cost must be positive")
    .refine(...decimalSchema()),
  promotionalPrice: z
    .number()
    .min(0, "Cost must be positive")
    .refine(...decimalSchema())
    .nullable()
    .transform((val) => (val ? (Number.isNaN(val) ? null : val) : null)),
  backupCost: z
    .number({ required_error: "Backup cost is required" })
    .min(0, "Cost must be positive")
    .refine(...decimalSchema())
})

export const createPlanSchema = basePlanSchema.refine(
  (data) =>
    data.promotionalPrice == null ||
    Number(data.promotionalPrice) > Number(data.hourlyCost),
  {
    path: ["promotionalPrice"],
    message: "Promotional price must be greater than selling price"
  }
)

export type CreatePlanSchema = z.infer<typeof createPlanSchema>

export const updatePlanSchema = basePlanSchema
  .omit({ plan: true })
  .refine(
    (data) =>
      data.promotionalPrice == null ||
      Number(data.promotionalPrice) > Number(data.hourlyCost),
    {
      path: ["promotionalPrice"],
      message: "Promotional price must be greater than selling price"
    }
  )

export type UpdatePlanSchema = z.infer<typeof updatePlanSchema>
