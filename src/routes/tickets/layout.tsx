import { Suspense } from "react"
import { Outlet } from "react-router"

import { PageSpinner } from "@/components/page-spinner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TicketsSidebar } from "./_components/tickets-sidebar"

export function TicketsLayout() {
  return (
    <SidebarProvider
      className="flex"
      style={{ "--sidebar-width": "18rem" } as React.CSSProperties}
    >
      <TicketsSidebar />
      <SidebarInset className="max-h-svh overflow-hidden">
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
