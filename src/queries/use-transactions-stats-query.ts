import { api } from "@/lib/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

export function useTransactionsStatsQuery(year: number) {
  const { data = { transactionsData: [], availableYears: [] }, ...query } =
    useQuery<{
      transactionsData: {
        month: number
        monthName: string
        count: number
        totalAmount: number
      }[]
      availableYears: string[]
    }>({
      queryKey: ["transactions-stats", year],
      placeholderData: keepPreviousData,
      queryFn: async () => {
        const { data } = await api.get(`/admin/stats/transactions?year=${year}`)
        return data
      }
    })

  return { ...query, data }
}
