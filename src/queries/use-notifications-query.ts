import type { Notification } from "@/types/db"

import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"
import { encodeQueryParams } from "@/lib/utils"

export function useNotificationsQuery() {
  const [params] = useQueryStates(
    {
      page: parseAsInteger,
      perPage: parseAsInteger,
      search: parseAsString,
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser()
    },
    { urlKeys: { search: "title" } }
  )

  const queryString = useMemo(() => encodeQueryParams(params), [params])

  const { data, ...query } = useQuery<{
    notifications: NotificationWithCount[]
    pageCount: number
  }>({
    queryKey: ["notifications", queryString],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(`/admin/notifications?${queryString}`)
      return data
    }
  })

  return {
    ...query,
    data: data?.notifications || [],
    pageCount: data?.pageCount || 1
  }
}

export type NotificationWithCount = Notification & {
  _count: { recipients: number }
}
