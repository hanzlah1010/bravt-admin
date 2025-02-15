import * as React from "react"
import orderBy from "lodash.orderby"
import { parseISO } from "date-fns"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryStates } from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"

import type { Resource } from "@/types/db"
import type { VultrSSHKey } from "@/types/vultr"

export function useSSHKeysQuery() {
  const { data = [], ...query } = useQuery<(VultrSSHKey & Resource)[]>({
    queryKey: ["ssh-keys"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/admin/ssh-keys")
      return data
    }
  })

  const [{ search, sort, from, to }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      from: parseAsString,
      to: parseAsString,
      sort: getSortingStateParser<VultrSSHKey & Resource>().withDefault([
        { id: "date_created", desc: true }
      ])
    },
    { urlKeys: { search: "name" } }
  )

  const handleSort = React.useCallback(
    (items: (VultrSSHKey & Resource)[]) => {
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
      data.filter((ssh) => {
        const matchesQuery =
          ssh.name.toLowerCase().includes(query) ||
          ssh.user.email.toLowerCase().includes(query) ||
          ssh.ssh_key.toLowerCase().includes(query)

        const sshDate = parseISO(ssh.date_created)

        const matchesDateRange =
          (!fromDate || sshDate >= fromDate) && (!toDate || sshDate <= toDate)

        return matchesQuery && matchesDateRange
      })
    )
  }, [handleSort, data, search, from, to])

  return { ...query, data: filteredData }
}
