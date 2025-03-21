import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

export function useSnapshotCostQuery() {
  return useQuery({
    queryKey: ["snapshot-cost"],
    queryFn: async () => {
      await new Promise((res) => setTimeout(res, 3000))
      const { data } = await api.get<{ cost: number }>("/snapshot/cost")
      return data?.cost
    }
  })
}
