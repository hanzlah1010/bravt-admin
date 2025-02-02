import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"

const Home = lazy(() => import("@/routes/home"))
const Plans = lazy(() => import("@/routes/plans"))

export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="block overflow-x-hidden px-6 pb-12">
        <Suspense
          fallback={
            <div className="flex min-h-screen items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <Routes>
            <Route index element={<Home />} />
            <Route path="/plans" element={<Plans />} />
          </Routes>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
