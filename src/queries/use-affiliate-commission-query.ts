import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useAffiliateCommissionQuery() {
  return useQuery({
    queryKey: ["affiliate-commission"],
    queryFn: async () => {
      const { data } = await api.get<{ commission: number }>(
        "/affiliate/commission"
      )
      return data?.commission
    }
  })
}
