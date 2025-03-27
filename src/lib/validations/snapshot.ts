import { z } from "zod"

export const createGlobalSnapshotSchema = z.object({
  id: z.string().min(1, "Snapshot ID is required").uuid("Invalid ID"),
  name: z.string().min(1, "OS name is required"),
  version: z.string().min(1, "OS version is required"),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required")
})

export type CreateGlobalSnapshotSchema = z.infer<
  typeof createGlobalSnapshotSchema
>

export const updateGlobalSnapshotSchema = createGlobalSnapshotSchema.omit({
  id: true
})

export type UpdateGlobalSnapshotSchema = z.infer<
  typeof updateGlobalSnapshotSchema
>

export const updateSnapshotCostSchema = z.object({
  cost: z
    .number({ required_error: "Snapshot cost is required" })
    .min(0, "Cost must be positive")
})

export type UpdateSnapshotCostSchema = z.infer<typeof updateSnapshotCostSchema>
