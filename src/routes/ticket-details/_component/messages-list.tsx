import * as React from "react"
import { VList } from "virtua"
import { ArrowDownIcon } from "lucide-react"
import { useParams } from "react-router"

import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { cn, formatMsgDate } from "@/lib/utils"
import { MessageBubble } from "./message-bubble"
import { useTicketMessagesQuery } from "@/queries/use-ticket-messages-query"
import { useSocket } from "@/providers/socket-provider"

import type { VListHandle } from "virtua"
import type { TicketMessage } from "@/types/db"

export function MessagesList({
  shouldStickToBottom
}: {
  shouldStickToBottom: React.RefObject<boolean>
}) {
  const { socket } = useSocket()
  const { ticketId } = useParams()
  const { data, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useTicketMessagesQuery(false)

  const ref = React.useRef<VListHandle>(null)
  const isFetchPending = React.useRef(false)
  const [isPrepend, setIsPrepend] = React.useState(false)
  const [isAtBottom, setIsAtBottom] = React.useState(true)
  const [hasUnseenMessages, setHasUnseenMessages] = React.useState(false)

  const flattenedMessages = React.useMemo(() => {
    const grouped = data.reduce<Record<string, TicketMessage[]>>((acc, msg) => {
      const date = formatMsgDate(msg.createdAt)
      if (!acc[date]) acc[date] = []
      acc[date].push(msg)
      return acc
    }, {})

    return Object.entries(grouped).flatMap(([date, messages]) => [
      { type: "date", value: date } as const,
      ...messages.map((msg) => ({ type: "message", value: msg }) as const)
    ])
  }, [data])

  const handleScroll = React.useCallback(
    async (offset: number) => {
      const el = ref.current
      if (!el) return
      shouldStickToBottom.current =
        offset - el.scrollSize + el.viewportSize >= -1.5

      if (
        hasNextPage &&
        !isFetchingNextPage &&
        !isFetchPending.current &&
        offset < 100
      ) {
        isFetchPending.current = true
        setIsPrepend(true)
        fetchNextPage().finally(() => (isFetchPending.current = false))
      }

      setIsAtBottom(
        el.viewportSize === 0 ||
          Math.abs(offset - el.scrollSize + el.viewportSize) < 100
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchNextPage, isFetchingNextPage, hasNextPage]
  )

  React.useEffect(() => {
    if (isPrepend && !isFetchingNextPage) setIsPrepend(false)
  }, [isFetchingNextPage, isPrepend])

  React.useEffect(() => {
    if (!ref.current || !shouldStickToBottom.current) return
    ref.current.scrollToIndex(flattenedMessages.length - 1, { align: "end" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flattenedMessages])

  React.useEffect(() => {
    if (!ref.current) return
    ref.current.scrollToIndex(flattenedMessages.length - 1, { align: "end" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId])

  React.useEffect(() => {
    const el = ref.current
    if (!socket || !el) return

    const onMessageCreate = () => {
      if (isAtBottom) {
        el.scrollToIndex(flattenedMessages.length - 1, { align: "end" })
      } else {
        setHasUnseenMessages(true)
      }
    }

    socket.on("message:create", onMessageCreate)
    return () => {
      socket.off("message:create", onMessageCreate)
    }
  }, [socket, flattenedMessages, isAtBottom])

  React.useEffect(() => {
    if (isAtBottom && hasUnseenMessages) setHasUnseenMessages(false)
  }, [hasUnseenMessages, isAtBottom])

  return (
    <div className="relative h-full flex-1">
      <VList
        reverse
        ref={ref}
        shift={isPrepend}
        onScroll={handleScroll}
        className="flex h-full flex-1 flex-col overflow-y-auto p-4"
      >
        {isFetchingNextPage && (
          <div className="flex w-full items-center justify-center p-2">
            <Spinner />
          </div>
        )}

        {flattenedMessages.map((item, idx) => {
          const nextItem = flattenedMessages[idx + 1]
          const prevItem = flattenedMessages[idx - 1]
          const isLastItem = idx === flattenedMessages.length - 1

          return item.type === "date" ? (
            <div
              key={`date-${item.value}-${idx}`}
              className={cn("mb-8 flex w-full items-center", {
                "mt-8": idx > 0
              })}
            >
              <hr className="h-px w-full flex-1 bg-border outline-none" />
              <p className="shrink-0 rounded-md bg-border px-3 py-0.5 text-xs text-muted-foreground">
                {item.value}
              </p>
              <hr className="h-px w-full flex-1 bg-border outline-none" />
            </div>
          ) : (
            <div
              key={`msg-${item.value.id}`}
              className={cn({
                "mb-4":
                  !isLastItem &&
                  (prevItem?.type === "message" || nextItem?.type === "message")
              })}
            >
              <MessageBubble message={item.value} />
            </div>
          )
        })}
      </VList>

      {!isAtBottom && (
        <Button
          size="icon"
          variant="outline"
          className="absolute inset-x-1/2 bottom-4 size-7 rounded-full bg-card"
          onClick={() => {
            ref.current?.scrollToIndex(flattenedMessages.length - 1, {
              align: "end"
            })
          }}
        >
          <ArrowDownIcon />
          {hasUnseenMessages && (
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-primary" />
          )}
        </Button>
      )}
    </div>
  )
}
