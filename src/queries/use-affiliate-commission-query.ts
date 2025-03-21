import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useAffiliateCommissionQuery() {
  return useQuery({
    queryKey: ["affiliate-commission"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 3000))
      const { data } = await api.get<{ commission: number }>(
        "/affiliate/commission"
      )
      return data?.commission
    }
  })
}
