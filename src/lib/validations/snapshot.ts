import { GLOBAL_SNAPSHOT_TYPE } from "@/types/db"
import { z } from "zod"

export const createGlobalSnapshotSchema = z.object({
  url: z.string().min(1, "Url is required"),
  description: z.string().min(1, "Description is required"),
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
