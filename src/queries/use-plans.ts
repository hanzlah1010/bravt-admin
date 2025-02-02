import { useMemo } from "react"
import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { VultrPlan } from "@/types/vultr"
import type { Plan } from "@/types/db"

export function usePlans() {
  const { data = [], ...query } = useQuery<(VultrPlan & Plan)[]>({
    queryKey: ["plans"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get("/plan")
      return data
    }
  })

  const plans = useMemo(() => {
    return data.map(({ hourlyCost, hourly_cost, ...item }) => ({
      instanceCost: hourlyCost,
      actualCost: hourly_cost,
      ...item
    }))
  }, [data])

  return { ...query, plans }
}

export type TablePlan = Pick<
  ReturnType<typeof usePlans>,
  "plans"
>["plans"][number]
