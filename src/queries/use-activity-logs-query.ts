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

import type { Activity } from "@/types/db"

export function useActivityLogsQuery() {
  const [params] = useQueryStates(
    {
      page: parseAsInteger,
      perPage: parseAsInteger,
      search: parseAsString,
      action: parseAsArrayOf(parseAsString),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser()
    },
    { urlKeys: { search: "message" } }
  )

  const queryString = useMemo(() => encodeQueryParams(params), [params])

  const { data, ...query } = useQuery<{
    activities: Activity[]
    pageCount: number
  }>({
    queryKey: ["activity-logs", queryString],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(`/admin/logs?${queryString}`)
      return data
    }
  })

  return {
    ...query,
    data: data?.activities || [],
    pageCount: data?.pageCount || 1
  }
}
