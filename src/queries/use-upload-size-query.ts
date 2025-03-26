import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

export function useUploadSizeQuery() {
  const { data, ...query } = useQuery<number>({
    queryKey: ["upload-size"],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await api.get(`/admin/logs/dir-size`)
      return data
    }
  })

  return { ...query, uploadSize: data ?? 0 }
}
