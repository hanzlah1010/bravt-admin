import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email(),
  password: z.string().min(1, "Password is required")
})

export type LoginSchema = z.infer<typeof loginSchema>

export const updateUserSchema = z.object({
  credits: z.number(),
  instanceCreateLimit: z
    .number()
    .int("Invalid limit")
    .min(0, "Must be positive"),
  dailyInstanceLimit: z
    .number()
    .int("Invalid limit")
    .min(0, "Must be positive"),
  dailyDeleteLimit: z.number().int("Invalid limit").min(0, "Must be positive")
})

export type UpdateUserSchema = z.infer<typeof updateUserSchema>
