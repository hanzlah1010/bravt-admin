import { Suspense } from "react"
import { Outlet } from "react-router"

import { PageSpinner } from "@/components/page-spinner"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { useApiKeysQuery } from "@/queries/use-api-keys-query"

export function MainLayout() {
  const { isPending } = useApiKeysQuery()

  if (isPending) {
    return <PageSpinner />
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
