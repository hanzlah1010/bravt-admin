import { Suspense } from "react"
import { Outlet } from "react-router"

import { Spinner } from "@/components/ui/spinner"
import { TicketsSidebar } from "./_components/tickets-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function TicketsLayout() {
  return (
    <SidebarProvider
      className="flex"
      style={
        {
          "--sidebar-width": "18rem"
        } as React.CSSProperties
      }
    >
      <TicketsSidebar />
      <SidebarInset className="max-h-svh overflow-hidden">
        <Suspense
          fallback={
            <div className="flex h-svh items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
