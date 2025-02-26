import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  AlertTriangle,
  ArrowDown,
  CheckCheckIcon,
  RefreshCw
} from "lucide-react"
import { useLocation } from "react-router"
import { formatDate } from "date-fns"

import { cn, formatMsgDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useSessionQuery } from "@/queries/use-session-query"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"

import { USER_ROLE, type TicketMessage } from "@/types/db"

export function TicketMessages() {
  const {
    data,
    status,
    refetch,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useTicketMessagesQuery()

  const { pathname } = useLocation()

  const containerRef = useRef<HTMLDivElement>(null)
  const initialLoad = useRef(true)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    if (
      container.scrollTop - container.scrollHeight + container.clientHeight >=
      -100
    ) {
      setIsAtBottom(true)
    } else {
      setIsAtBottom(false)
    }

    if (container.scrollTop <= 100 && hasNextPage && !isFetchingNextPage) {
      const previousScrollHeight = container.scrollHeight

      fetchNextPage().then(() => {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop =
              containerRef.current.scrollHeight - previousScrollHeight
          }
        })
      })
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  const scrollToBottom = useCallback(() => {
    const container = containerRef.current
    if (!container) return
    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth"
    })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!initialLoad.current) {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        400

      if (isNearBottom) {
        scrollToBottom()
      }
    }
  }, [data, scrollToBottom])

  useEffect(() => {
    const container = containerRef.current
    if (container && initialLoad.current && data.length > 0) {
      container.scrollTop = container.scrollHeight
      initialLoad.current = false
    }
  }, [data])

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [pathname])

  const groupedMessages = useMemo(() => {
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
        className="relative size-full flex-1 space-y-8 overflow-y-auto overflow-x-hidden p-4"
      >
        {isFetchingNextPage && (
          <div className="flex w-full justify-center p-4">
            <Spinner />
          </div>
        )}

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

      {!isAtBottom && (
        <Button
          size="icon"
          variant="outline"
          className="absolute inset-x-1/2 bottom-4 size-7 rounded-full bg-card"
          onClick={scrollToBottom}
        >
          <ArrowDown />
        </Button>
      )}
    </div>
  )
}

type MessageBubbleProps = {
  message: TicketMessage
}

function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useSessionQuery()
  const isCurrentUserMessage =
    user.id === message.senderId || message.sender.role === USER_ROLE.ADMIN

  return (
    <li
      className={cn(
        "w-fit max-w-full md:max-w-lg",
        isCurrentUserMessage ? "ml-auto" : "mr-auto"
      )}
    >
      <p
        className={cn(
          "whitespace-pre-wrap break-words rounded-lg px-3 py-1.5 text-sm font-medium md:max-w-lg",
          isCurrentUserMessage
            ? "ml-auto bg-primary text-primary-foreground"
            : "mr-auto bg-muted"
        )}
      >
        {message.message}
      </p>

      <div
        className={cn("mt-1 flex items-center gap-2", {
          "justify-end": !isCurrentUserMessage
        })}
      >
        <p className="text-xs text-muted-foreground">
          {formatDate(message.createdAt, "hh:mm aa")}
        </p>

        {isCurrentUserMessage && (
          <CheckCheckIcon
            className={cn(
              "size-3.5",
              message.seen ? "text-primary" : "text-muted-foreground"
            )}
          >
            <title>
              {message.seen
                ? formatDate(message.seen, "PPP hh:mm aa")
                : "Unseen"}
            </title>
          </CheckCheckIcon>
        )}
      </div>
    </li>
  )
}
