import { keepPreviousData, useQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"

import type { PaymentKey } from "@/types/db"

export function usePaymentKeysQuery(enabled = true) {
  const { data, ...query } = useQuery({
    enabled,
    placeholderData: keepPreviousData,
    queryKey: ["payment-keys"],
    queryFn: async () => {
      const { data } = await api.get<PaymentKey[]>("/admin/api-keys/payment")
      return data
    }
  })

  return { ...query, data }
}
