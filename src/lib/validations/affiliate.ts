import { z } from "zod"

export const updateAffiliateCommissionSchema = z.object({
  amount: z
    .number({ required_error: "Snapshot cost is required" })
    .min(0, "Commission must be positive")
    .max(100, "Must be less than 100")
})

export type UpdateAffiliateCommissionSchema = z.infer<
  typeof updateAffiliateCommissionSchema
>
