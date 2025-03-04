import { useEffect, useRef, useState } from "react"

import { Spinner } from "@/components/ui/spinner"

import type { UseInfiniteQueryResult } from "@tanstack/react-query"

type InfiniteScrollProps = Pick<
  UseInfiniteQueryResult,
  "hasNextPage" | "isFetchingNextPage" | "fetchNextPage"
>

export function InfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage
}: InfiniteScrollProps) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.5 }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (hasNextPage && !isFetchingNextPage) {
    return <div ref={ref} className="h-2 w-full shrink-0" />
  }

  if (isFetchingNextPage) {
    return (
      <div className="flex w-full shrink-0 items-center justify-center py-2">
        <Spinner size="sm" />
      </div>
    )
  }

  return null
}
