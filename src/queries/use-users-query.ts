import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsString,
  useQueryStates
} from "nuqs"

import { api } from "@/lib/api"
import { encodeQueryParams } from "@/lib/utils"
import { getSortingStateParser } from "@/lib/parsers"

import type { User } from "@/types/db"

export function useUsersQuery() {
  const [params] = useQueryStates(
    {
      page: parseAsInteger,
      perPage: parseAsInteger,
      search: parseAsString,
      isSubscribed: parseAsArrayOf(parseAsBoolean, ","),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<User>()
    },
    { urlKeys: { search: "firstName" } }
  )

  const queryString = useMemo(() => encodeQueryParams(params), [params])

  const { data, ...query } = useQuery<{
    pageCount: number
    users: Omit<User, "passwordHash">[]
  }>({
    queryKey: ["users", queryString],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(`/admin/user?${queryString}`)
      return data
    }
  })

  return {
    ...query,
    data: data?.users || [],
    pageCount: data?.pageCount || 1
  }
}
