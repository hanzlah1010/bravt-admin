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
import { isInstanceInstalling } from "@/lib/utils"

import type { Resource } from "@/types/db"
import type { VultrInstance } from "@/types/vultr"

export function useInstancesQuery() {
  const { data = [], ...query } = useQuery<(VultrInstance & Resource)[]>({
    queryKey: ["instances"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/instances")
      return data
    },
    refetchInterval: ({ state }) => {
      return state.data?.some((item) => isInstanceInstalling(item)) ? 5000 : 0
    }
  })

  const [{ search, sort, from, status, to }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsArrayOf(
        parseAsStringEnum(["running", "stopped", "installing"])
      ).withDefault([]),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<VultrInstance & Resource>().withDefault([
        { id: "date_created", desc: true }
      ])
    },
    { urlKeys: { search: "label", status: "power_status" } }
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

    if (!query && !status && !fromDate && !toDate) {
      return handleSort(data)
    }

    return handleSort(
      data.filter((instance) => {
        const matchesQuery =
          instance.label.toLowerCase().includes(query) ||
          instance.hostname.toLowerCase().includes(query) ||
          instance.user.email.toLowerCase().includes(query)

        const isInstalling = isInstanceInstalling(instance)
        const powerStatus = isInstalling ? "installing" : instance.power_status
        const matchesStatus = !status.length || status.includes(powerStatus)

        const instanceDate = parseISO(instance.date_created)

        const matchesDateRange =
          (!fromDate || instanceDate >= fromDate) &&
          (!toDate || instanceDate <= toDate)

        return matchesQuery && matchesStatus && matchesDateRange
      })
    )
  }, [handleSort, data, search, from, to, status])

  return { ...query, data: filteredData }
}
