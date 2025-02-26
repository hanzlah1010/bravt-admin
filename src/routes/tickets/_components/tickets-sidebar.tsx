import { ArrowLeft, CirclePlus } from "lucide-react"
import { Link, useLocation, useParams } from "react-router"
import { parseAsBoolean, useQueryState } from "nuqs"

import { TicketsList } from "./tickets-list"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useDebouncedQueryState } from "@/hooks/use-debounced-query-state"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  useSidebar
} from "@/components/ui/sidebar"

export function TicketsSidebar() {
  const [search, setSearch] = useDebouncedQueryState("search")
  const [closed, setClosed] = useQueryState(
    "closed",
    parseAsBoolean.withDefault(false)
  )

  const { pathname } = useLocation()
  const { ticketId } = useParams()
  const { isMobile } = useSidebar()
  const isTicketDetails = pathname === `/tickets/${ticketId}`

  return (
    <Sidebar showMobileSheet={isTicketDetails}>
      <SidebarHeader className="p-0 pt-3">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="size-7 rounded-full"
            >
              <Link to="/">
                <ArrowLeft />
              </Link>
            </Button>
            <h1 className="text-lg font-semibold">Tickets</h1>
          </div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="size-7"
                aria-label="Open Ticket"
              >
                <CirclePlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Open Ticket</TooltipContent>
          </Tooltip>
        </div>

        <div className="px-3">
          <SidebarInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets..."
            autoFocus={isMobile && isTicketDetails}
          />
        </div>

        <div className="relative grid grid-cols-2 border-b pt-1">
          {["Open", "Closed"].map((state) => (
            <div key={state} className="w-full px-3 pb-2">
              <button
                key={state}
                onClick={() => setClosed(state === "Closed")}
                className="w-full rounded-md py-0.5 text-sm transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {state}
              </button>
            </div>
          ))}

          <div
            className={cn(
              "absolute bottom-0 h-0.5 w-1/2 bg-primary transition-transform duration-300",
              closed ? "translate-x-full" : "translate-x-0"
            )}
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="flex-1">
          <TicketsList />
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
