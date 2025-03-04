import { Link, useLocation } from "react-router"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { parseAsBoolean, useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"
import { useTicketsQuery } from "@/queries/use-tickets-query"
import { Skeleton } from "@/components/ui/skeleton"
import { getErrorMessage } from "@/lib/error"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatMsgDate, getUserInitials } from "@/lib/utils"
import { InfiniteScroll } from "@/components/infinite-scroll"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

export function TicketsList() {
  const [closed] = useQueryState("closed", parseAsBoolean)
  const { pathname } = useLocation()
  const { data, isPending, error, refetch, updateTicket, ...query } =
    useTicketsQuery()

  if (isPending) {
    return (
      <SidebarMenu className="space-y-1 overflow-y-auto p-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <SidebarMenuItem
            key={i}
            className="flex h-14 items-center justify-center gap-2 px-2"
          >
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="w-full flex-1 space-y-1">
              <Skeleton className="h-3 w-1/2 rounded" />
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    )
  }

  if (error) {
    return (
      <SidebarMenu className="flex h-full flex-col items-center justify-center gap-2">
        <AlertTriangle className="size-5 text-destructive" />
        <p className="text-center text-sm text-destructive">
          {getErrorMessage(error)}
        </p>
        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCw />
          Retry
        </Button>
      </SidebarMenu>
    )
  }

  if (!data.length) {
    return (
      <SidebarMenu className="flex h-full flex-col items-center justify-center gap-2">
        <AlertTriangle className="size-5 text-muted-foreground" />
        <p className="text-center text-sm">No tickets found.</p>
      </SidebarMenu>
    )
  }

  return (
    <SidebarMenu className="space-y-1 overflow-y-auto p-0.5">
      {data.map((ticket) => (
        <SidebarMenuItem key={ticket.id}>
          <SidebarMenuButton
            asChild
            key={ticket.id}
            className="h-auto"
            isActive={pathname === `/tickets/${ticket.id}`}
          >
            <Link
              onClick={() => updateTicket(ticket.id, { unseenMessages: 0 })}
              title={`${ticket.user.firstName ? `${ticket.user.firstName} ${ticket.user.lastName}\n` : ""}${ticket.user.email}\n${ticket.topic}\n${format(ticket.lastMessageAt ?? ticket.createdAt, "PPP hh:mm aa")}`}
              to={{
                pathname: `/tickets/${ticket.id}`,
                search: closed ? "?closed=true" : ""
              }}
            >
              <Avatar>
                <AvatarFallback className="bg-muted-foreground/20">
                  {getUserInitials(ticket.user)}
                </AvatarFallback>
              </Avatar>
              <div className="flex w-full flex-col">
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="line-clamp-1 break-all text-[13px] font-medium">
                    {ticket.user.email}
                  </span>

                  <span className="whitespace-nowrap text-[10px] text-muted-foreground">
                    {formatMsgDate(ticket.lastMessageAt)}
                  </span>
                </div>

                <div className="flex w-full items-center justify-between gap-2">
                  <span className="line-clamp-1 break-all text-xs text-muted-foreground">
                    {ticket.topic}
                  </span>
                  {ticket.unseenMessages > 0 && (
                    <span className="flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary px-[5px] py-0 text-sm text-primary-foreground">
                      {ticket.unseenMessages}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}

      <InfiniteScroll {...query} />
    </SidebarMenu>
  )
}
