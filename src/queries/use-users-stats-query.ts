import { api } from "@/lib/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export function useUserStatsQuery(year: string) {
  const { data = { usersData: [], availableYears: [] }, ...query } = useQuery<{
    usersData: {
      month: number
      monthName: string
      count: number
    }[]
    availableYears: string[]
  }>({
    queryKey: ["user-stats", year],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(`/admin/stats/user?year=${year}`)
      return data
    }
  })

  return { ...query, data }
}
