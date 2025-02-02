import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import type { PropsWithChildren } from "react"

export function QueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
