import { GLOBAL_SNAPSHOT_TYPE } from "@/types/db"
import { z } from "zod"

export const createGlobalSnapshotDialog = z.object({
  url: z.string().min(1, "Url is required"),
  description: z.string().min(1, "Description is required"),
  type: z.nativeEnum(GLOBAL_SNAPSHOT_TYPE, {
    required_error: "Please select snapshot type"
  })
})

export type CreateGlobalSnapshotDialog = z.infer<
  typeof createGlobalSnapshotDialog
>
