import { z } from "zod"

import { PAYMENT_METHOD } from "@/types/db"

export const apiKeySchema = z.object({
  name: z.string().min(1, "Please enter a unique name for your api key"),
  key: z.string().min(1, "Please enter you api key"),
  active: z.boolean()
})

export type ApiKeySchema = z.infer<typeof apiKeySchema>

export const createPaymentKeySchema = z.object({
  clientId: z.string().min(1, "Client id is required"),
  clientSecret: z.string().min(1, "Client secret is required"),
  webhookId: z.string().min(1, "Webhook id is required"),
  type: z.nativeEnum(PAYMENT_METHOD, {
    required_error: "Please select api key type"
  })
})

export type CreatePaymentKeySchema = z.infer<typeof createPaymentKeySchema>
