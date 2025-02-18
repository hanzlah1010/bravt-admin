import * as React from "react"
import orderBy from "lodash.orderby"
import { parseISO } from "date-fns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryStates } from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"

import type { Resource } from "@/types/db"
import type { VultrFirewallGroup } from "@/types/vultr"

export function useFirewallGroupsQuery() {
  const { data = [], ...query } = useQuery<(VultrFirewallGroup & Resource)[]>({
    queryKey: ["firewall-groups"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/firewall-groups")
      return data
    }
  })

  const [{ search, sort, from, to }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<VultrFirewallGroup & Resource>().withDefault([
        { id: "date_created", desc: true }
      ])
    },
    { urlKeys: { search: "description" } }
  )

  const handleSort = React.useCallback(
    (items: (VultrFirewallGroup & Resource)[]) => {
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
      data.filter((firewall) => {
        const matchesQuery =
          firewall.description.toLowerCase().includes(query) ||
          firewall.user.email.toLowerCase().includes(query)

        const firewallDate = parseISO(firewall.date_created)

        const matchesDateRange =
          (!fromDate || firewallDate >= fromDate) &&
          (!toDate || firewallDate <= toDate)

        return matchesQuery && matchesDateRange
      })
    )
  }, [handleSort, data, search, from, to])

  return { ...query, data: filteredData }
}
