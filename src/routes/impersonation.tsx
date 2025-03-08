import { Ban } from "lucide-react"
import { useMutation } from "@tanstack/react-query"

import { api, setAccessToken } from "@/lib/api"
import { handleError } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { useSessionQuery } from "@/queries/use-session-query"
import { Spinner } from "@/components/ui/spinner"

export default function Impersonation() {
  const { user } = useSessionQuery()

  const { isPending, mutate: stopImpersonate } = useMutation({
    mutationFn: async () => {
      const { data } = await api.post<{ token: string }>(
        "/auth/impersonate/stop"
      )
      return data
    },
    onSuccess: ({ token }) => {
      setAccessToken(token)
      window.location.reload()
    },
    onError: handleError
  })

  return (
    <div className="flex h-full min-h-svh flex-col items-center justify-center text-center">
      <h1 className="text-pretty font-serif text-6xl font-bold">403</h1>
      <p className="text-[17px] text-muted-foreground">
        You are currently impersonating{" "}
        <span className="whitespace-nowrap text-foreground">{user.email}</span>
      </p>
      <Button size="sm" className="mt-2" onClick={() => stopImpersonate()}>
        {isPending ? <Spinner size="sm" /> : <Ban className="size-4" />}
        Stop impersonating
      </Button>
    </div>
  )
}
