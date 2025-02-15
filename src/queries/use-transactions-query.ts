import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  useQueryStates
} from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"
import { encodeQueryParams } from "@/lib/utils"

import type { Transaction } from "@/types/db"

export function useTransactionsQuery() {
  const [params] = useQueryStates(
    {
      page: parseAsInteger,
      perPage: parseAsInteger,
      search: parseAsString,
      status: parseAsArrayOf(parseAsString),
      method: parseAsArrayOf(parseAsString),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser()
    },
    { urlKeys: { search: "amount" } }
  )

  const queryString = useMemo(() => encodeQueryParams(params), [params])

  const { data, ...query } = useQuery<{
    transactions: Transaction[]
    pageCount: number
  }>({
    queryKey: ["transactions", queryString],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(`/admin/transactions?${queryString}`)
      return data
    }
  })

  return {
    ...query,
    data: data?.transactions || [],
    pageCount: data?.pageCount || 1
  }
}
