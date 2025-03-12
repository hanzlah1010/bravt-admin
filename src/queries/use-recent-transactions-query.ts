import { api } from "@/lib/api"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import type { Transaction } from "@/types/db"

export function useRecentTransactionsQuery() {
  const { data = [], ...query } = useQuery<Transaction[]>({
    queryKey: ["recent-transactions"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/stats/transactions/recent")
      return data
    }
  })

  return { ...query, data }
}
