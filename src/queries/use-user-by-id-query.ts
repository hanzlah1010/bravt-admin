import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { ResourceBilling, User } from "@/types/db"

export function useUserByIdQuery(userId: string) {
  return useQuery<
    User & {
      billingHistory: ResourceBilling[]
      totalAmountBilled: number
      firewallCount: number
      instancesCount: number
      snapshotsCount: number
      sshCount: number
      instancesCreatedToday: number
      instancesDeletedToday: number
    }
  >({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) return
      const { data } = await api.get(`/admin/user/${userId}`)
      return data
    }
  })
}
