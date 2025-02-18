import { api } from "@/lib/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export function useAnalyticsQuery() {
  return useQuery<
    Record<"users" | "transactions" | "subscribedUsers", AnalyticsData>
  >({
    queryKey: ["analytics"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/stats")
      return data
    }
  })
}

export interface AnalyticsData {
  total: number
  newThisMonth: number
  growthPercentage: number
}
