import { z } from "zod"

export const updateSSHKeySchema = z.object({
  name: z.string().min(1, "Name is required"),
  key: z
    .string()
    .min(1, "SSH Key is required")
    .trim()
    .regex(
      /^(?:ssh-(?:rsa|dss|ed25519)|ecdsa-sha2-nistp(?:256|384|521)|sk-(?:ssh-ed25519|ecdsa-sha2-nistp256)@openssh\.com) [A-Za-z0-9+/]{32,}={0,3}(?: .*)?$/,
      "Invalid SSH Key"
    )
})

export type UpdateSSHKeySchema = z.infer<typeof updateSSHKeySchema>
