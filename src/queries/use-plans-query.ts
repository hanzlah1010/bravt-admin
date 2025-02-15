import * as React from "react"
import orderBy from "lodash.orderby"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { parseAsString, useQueryStates } from "nuqs"

import { api } from "@/lib/api"
import { getSortingStateParser } from "@/lib/parsers"

import type { VultrPlan } from "@/types/vultr"
import type { Plan } from "@/types/db"

export function usePlansQuery() {
  const { data = [], ...query } = useQuery({
    queryKey: ["plans"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get<(VultrPlan & Plan)[]>("/admin/plan")
      return data.map(({ hourlyCost, hourly_cost, ...item }) => ({
        instanceCost: hourlyCost,
        actualCost: hourly_cost,
        ...item
      }))
    }
  })

  const [{ search, sort }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      sort: getSortingStateParser<(typeof data)[number]>().withDefault([
        { id: "instanceCost", desc: false }
      ])
    },
    { urlKeys: { search: "plan" } }
  )

  const handleSort = React.useCallback(
    (items: typeof data) => {
      return orderBy(
        items,
        sort.map((s) => s.id),
        sort.map((s) => (s.desc ? "desc" : "asc"))
      )
    },
    [sort]
  )

  const filteredData = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return handleSort(data)
    return handleSort(
      data.filter((plan) => {
        return (
          plan.plan.toLowerCase().trim().includes(query) ||
          plan.type.toLowerCase().includes(query) ||
          plan.id.toLowerCase().includes(query) ||
          [
            plan.monthlyCost,
            plan.monthly_cost,
            plan.instanceCost,
            plan.actualCost,
            plan.backupCost,
            plan.backupCost * 24 * 30,
            plan.locations,
            plan.vcpu_count,
            plan.ram
          ].some((v) => String(v).includes(query))
        )
      })
    )
  }, [data, search, handleSort])

  return { ...query, data: filteredData }
}

export type TablePlan = Pick<
  ReturnType<typeof usePlansQuery>,
  "data"
>["data"][number]
