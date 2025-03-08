import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { ApiKey } from "@/types/db"

export function useApiKeysQuery(enabled = true) {
  const { data, ...query } = useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryKey: ["api-keys"],
    queryFn: async () => {
      const { data } = await api.get<ApiKey[]>("/admin/api-keys")
      return data
    }
  })

  return { ...query, data }
}
