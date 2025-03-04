import { z } from "zod"

export const createNotificationSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required"),
    validTill: z.date({ required_error: "Please select validity date" }),
    sentToAll: z.enum(["ALL_TIME", "CURRENT"]).optional(),
    userIds: z
      .string()
      .min(1)
      .cuid2()
      .array()
      .min(1, "Please select at least 1 user")
      .optional()
  })
  .refine(
    (data) => (data.sentToAll ? !data.userIds?.length : !!data.userIds?.length),
    {
      message: "One of 'sentToAll' or 'userIds' must be provided.",
      path: ["sentToAll", "userIds"]
    }
  )

export type CreateNotificationSchema = z.infer<typeof createNotificationSchema>

export const updateNotificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  message: z.string().min(1, "Message is required"),
  validTill: z.date({ required_error: "Please select validity date" })
})

export type UpdateNotificationSchema = z.infer<typeof updateNotificationSchema>
