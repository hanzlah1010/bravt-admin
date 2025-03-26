import { GLOBAL_SNAPSHOT_TYPE } from "@/types/db"
import { z } from "zod"

export const createGlobalSnapshotSchema = z.object({
  id: z.string().min(1, "Snapshot ID is required").uuid("Invalid ID"),
  type: z.nativeEnum(GLOBAL_SNAPSHOT_TYPE, {
    required_error: "Please select snapshot type"
  })
})

export type CreateGlobalSnapshotSchema = z.infer<
  typeof createGlobalSnapshotSchema
>

export const updateSnapshotCostSchema = z.object({
  cost: z
    .number({ required_error: "Snapshot cost is required" })
    .min(0, "Cost must be positive")
})

export type UpdateSnapshotCostSchema = z.infer<typeof updateSnapshotCostSchema>
