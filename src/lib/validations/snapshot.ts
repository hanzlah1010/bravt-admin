import { z } from "zod"

export const createGlobalSnapshotDialog = z.object({
  url: z.string().min(1, "Url is required"),
  description: z.string().min(1, "Description is required")
})

export type CreateGlobalSnapshotDialog = z.infer<
  typeof createGlobalSnapshotDialog
>
