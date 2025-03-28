import * as React from "react"
import { useParams } from "react-router"
import { AlertTriangle, ArrowDown, RefreshCw } from "lucide-react"

import { formatMsgDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { MessageBubble } from "./message-bubble"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"

import type { TicketMessage } from "@/types/db"

export function TicketMessages() {
  const { ticketId } = useParams()
  const {
    rawData,
    data,
    status,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useTicketMessagesQuery()

  const containerRef = React.useRef<HTMLDivElement>(null)
  const sentinelRef = React.useRef<HTMLDivElement>(null)
  const prevScrollHeightRef = React.useRef<number>(0)
  const isFetchingMore = React.useRef(false)
  const [isAtBottom, setIsAtBottom] = React.useState(true)

  const handleScroll = React.useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100

    setIsAtBottom(isNearBottom)
  }, [])

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      const container = containerRef.current
      if (!container) return
      container.scrollTo({
        top: container.scrollHeight,
        behavior
      })
    },
    []
  )

  React.useLayoutEffect(() => {
    requestAnimationFrame(() => {
      if (containerRef.current) {
        containerRef.current.scrollTop = containerRef.current.scrollHeight
      }
    })
  }, [ticketId])

  React.useLayoutEffect(() => {
    if (!isFetchingMore.current) setTimeout(scrollToBottom, 100)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData?.pages?.[0].messages.length])

  React.useEffect(() => {
    if (isFetchingNextPage) {
      const container = containerRef.current
      if (container) {
        prevScrollHeightRef.current = container.scrollHeight
      }
      isFetchingMore.current = true
    }
  }, [isFetchingNextPage])

  React.useLayoutEffect(() => {
    if (isFetchingMore.current) {
      const container = containerRef.current
      if (container) {
        const newScrollHeight = container.scrollHeight
        const scrollDiff = newScrollHeight - prevScrollHeightRef.current
        container.scrollTop = container.scrollTop + scrollDiff
      }
      isFetchingMore.current = false
    }
  }, [data])

  React.useEffect(() => {
    const container = containerRef.current
    const sentinel = sentinelRef.current
    if (!container || !sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root: container, rootMargin: "100px" }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const groupedMessages = React.useMemo(() => {
    return data.reduce<Record<string, TicketMessage[]>>((grouped, msg) => {
      const date = formatMsgDate(msg.createdAt)
      if (!grouped[date]) grouped[date] = []
      grouped[date].push(msg)
      return grouped
    }, {})
  }, [data])

  if (status === "pending") {
    return (
      <div className="flex size-full flex-1 flex-col items-center justify-center gap-1 text-center">
        <Spinner />
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex size-full flex-1 flex-col items-center justify-center gap-1 space-y-2 overflow-hidden text-center">
        <AlertTriangle />
        <p className="text-sm text-muted-foreground">
          Failed to fetch messages! Please try again
        </p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="relative size-full overflow-y-hidden">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative flex size-full flex-1 flex-col overflow-y-auto overflow-x-hidden"
      >
        <div ref={sentinelRef} />

        {isFetchingNextPage && (
          <div className="flex w-full items-center justify-center p-4">
            <Spinner />
          </div>
        )}

        <div className="mt-auto space-y-8 p-4">
          {Object.entries(groupedMessages).map(([date, messages]) => (
            <div key={date} className="space-y-8">
              <div className="flex w-full items-center">
                <hr className="h-px w-full flex-1 bg-border outline-none" />
                <p className="shrink-0 rounded-md bg-border px-3 py-0.5 text-xs text-muted-foreground">
                  {date}
                </p>
                <hr className="h-px w-full flex-1 bg-border outline-none" />
              </div>

              <ul className="space-y-2">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {!isAtBottom && (
        <Button
          size="icon"
          variant="outline"
          className="absolute inset-x-1/2 bottom-4 size-7 rounded-full bg-card"
          onClick={() => scrollToBottom()}
        >
          <ArrowDown />
        </Button>
      )}
    </div>
  )
}
