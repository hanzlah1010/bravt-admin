import { z } from "zod"

export const apiKeySchema = z.object({
  name: z.string().min(1, "Please enter a unique name for your api key"),
  key: z.string().min(1, "Please enter you api key"),
  active: z.boolean()
})

export type ApiKeySchema = z.infer<typeof apiKeySchema>
