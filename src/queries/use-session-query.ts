import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { User } from "@/types/db"

export function useSessionQuery() {
  const { data, ...query } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await api.get<User & { impersonatedBy?: string }>(
        "/auth/session"
      )
      return data
    }
  })

  return { user: data as NonNullable<typeof data>, ...query }
}
