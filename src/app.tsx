import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"

const Home = lazy(() => import("@/routes/home"))
const Plans = lazy(() => import("@/routes/plans"))
const Customers = lazy(() => import("@/routes/customers"))
const Transactions = lazy(() => import("@/routes/transactions"))
const ActivityLogs = lazy(() => import("@/routes/activity-logs"))
const SSHKeys = lazy(() => import("@/routes/ssh-keys"))
const ISO = lazy(() => import("@/routes/iso"))
const Firewalls = lazy(() => import("@/routes/firewalls"))

export function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="block overflow-x-hidden px-6 pb-12">
        <Suspense
          fallback={
            <div className="flex h-svh items-center justify-center">
              <Spinner size="lg" />
            </div>
          }
        >
          <Routes>
            <Route index element={<Home />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
            <Route path="/ssh-keys" element={<SSHKeys />} />
            <Route path="/iso" element={<ISO />} />
            <Route path="/firewalls" element={<Firewalls />} />
          </Routes>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
