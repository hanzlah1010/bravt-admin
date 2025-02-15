import * as React from "react"
import orderBy from "lodash.orderby"
import { parseISO } from "date-fns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryStates } from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"

import type { Resource } from "@/types/db"
import type { VultrISO } from "@/types/vultr"

export function useISOsQuery() {
  const { data = [], ...query } = useQuery<(VultrISO & Resource)[]>({
    queryKey: ["isos"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/isos")
      return data
    },
    refetchInterval: ({ state }) => {
      return state.data?.some((item) => item.status === "pending") ? 5000 : 0
    }
  })

  const [{ search, sort, from, to }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<VultrISO & Resource>().withDefault([
        { id: "date_created", desc: true }
      ])
    },
    { urlKeys: { search: "name" } }
  )

  const handleSort = React.useCallback(
    (items: (VultrISO & Resource)[]) => {
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
      data.filter((iso) => {
        const matchesQuery =
          iso.filename.toLowerCase().includes(query) ||
          iso.user.email.toLowerCase().includes(query)

        const isoDate = parseISO(iso.date_created)

        const matchesDateRange =
          (!fromDate || isoDate >= fromDate) && (!toDate || isoDate <= toDate)

        return matchesQuery && matchesDateRange
      })
    )
  }, [handleSort, data, search, from, to])

  return { ...query, data: filteredData }
}
