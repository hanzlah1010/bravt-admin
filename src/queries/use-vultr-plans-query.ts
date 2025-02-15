import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

import type { VultrPlan } from "@/types/vultr"

export function useVultrPlansQuery() {
  const { data = [], ...query } = useQuery<VultrPlan[]>({
    queryKey: ["vultr-plans"],
    queryFn: async () => {
      const { data } = await api.get("/admin/plan/vultr")
      return data
    }
  })

  return { ...query, plans: data }
}
