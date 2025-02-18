import * as React from "react"
import orderBy from "lodash.orderby"
import { parseISO } from "date-fns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryStates } from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"

import type { Resource } from "@/types/db"
import type { VultrInstance } from "@/types/vultr"

export function useInstancesQuery() {
  const { data = [], ...query } = useQuery<(VultrInstance & Resource)[]>({
    queryKey: ["instances"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/instances")
      return data
    }
  })

  const [{ search, sort, from, to }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<VultrInstance & Resource>().withDefault([
        { id: "date_created", desc: true }
      ])
    },
    { urlKeys: { search: "label" } }
  )

  const handleSort = React.useCallback(
    (items: (VultrInstance & Resource)[]) => {
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

    if (!query && !fromDate && !toDate) {
      return handleSort(data)
    }

    return handleSort(
      data.filter((instance) => {
        const matchesQuery =
          instance.label.toLowerCase().includes(query) ||
          instance.hostname.toLowerCase().includes(query) ||
          instance.user.email.toLowerCase().includes(query)

        const instanceDate = parseISO(instance.date_created)

        const matchesDateRange =
          (!fromDate || instanceDate >= fromDate) &&
          (!toDate || instanceDate <= toDate)

        return matchesQuery && matchesDateRange
      })
    )
  }, [handleSort, data, search, from, to])

  return { ...query, data: filteredData }
}
