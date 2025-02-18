import * as React from "react"
import orderBy from "lodash.orderby"
import { parseISO } from "date-fns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import {
  parseAsArrayOf,
  parseAsString,
  parseAsStringEnum,
  useQueryStates
} from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"

import type { Resource } from "@/types/db"
import type { VultrSnapshot } from "@/types/vultr"

export function useSnapshotsQuery() {
  const { data = [], ...query } = useQuery<(VultrSnapshot & Resource)[]>({
    queryKey: ["snapshots"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/snapshots")
      return data
    },
    refetchInterval: ({ state }) => {
      return state.data?.some((item) => item.status === "pending") ? 5000 : 0
    }
  })

  const [{ search, sort, status, from, to }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsArrayOf(
        parseAsStringEnum(["pending", "complete"])
      ).withDefault([]),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<VultrSnapshot & Resource>().withDefault([
        { id: "date_created", desc: true }
      ])
    },
    { urlKeys: { search: "description" } }
  )

  const handleSort = React.useCallback(
    (items: (VultrSnapshot & Resource)[]) => {
      return orderBy(
        items,
        sort.map((s) => {
          if (s.id === "user") return "user.email"
          return s.id
        }),
        sort.map((s) => (s.desc ? "desc" : "asc"))
      )
    },
    [sort]
  )

  const filteredData = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    const fromDate = from ? parseISO(from) : null
    const toDate = to ? parseISO(to) : null

    if (!query && !status && !fromDate && !toDate) {
      return handleSort(data)
    }

    return handleSort(
      data.filter((snapshot) => {
        const matchesQuery =
          snapshot.description.toLowerCase().includes(query) ||
          snapshot.user.email.toLowerCase().includes(query)

        const matchesStatus = !status.length || status.includes(snapshot.status)

        const snapshotDate = parseISO(snapshot.date_created)

        const matchesDateRange =
          (!fromDate || snapshotDate >= fromDate) &&
          (!toDate || snapshotDate <= toDate)

        return matchesQuery && matchesStatus && matchesDateRange
      })
    )
  }, [handleSort, data, search, from, to, status])

  return { ...query, data: filteredData }
}
