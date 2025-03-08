import { useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { User } from "@/types/db"

export function useSessionQuery() {
  const { data, ...query } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data } = await api.get<User>("/auth/session")
      return data
    }
  })

  console.log(data)

  return { user: data as User, ...query }
}
