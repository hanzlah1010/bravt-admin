import { useState } from "react"
import { AxiosError } from "axios"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import type { PropsWithChildren } from "react"

export function QueryProvider(props: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              const shouldNotRetry =
                error instanceof AxiosError &&
                error.status &&
                [404, 401, 403].includes(error.status)

              return shouldNotRetry ? false : failureCount < 3
            }
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {props.children}
    </QueryClientProvider>
  )
}
