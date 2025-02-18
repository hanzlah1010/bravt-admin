import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"

const Analytics = lazy(() => import("@/routes/analytics"))
const Plans = lazy(() => import("@/routes/plans"))
const Customers = lazy(() => import("@/routes/customers"))
const Transactions = lazy(() => import("@/routes/transactions"))
const ActivityLogs = lazy(() => import("@/routes/activity-logs"))
const SSHKeys = lazy(() => import("@/routes/ssh-keys"))
const ISO = lazy(() => import("@/routes/iso"))
const FirewallGroups = lazy(() => import("@/routes/firewall-groups"))
const Snapshots = lazy(() => import("@/routes/snapshots"))
const Instances = lazy(() => import("@/routes/instances"))

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
            <Route index element={<Analytics />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
            <Route path="/ssh-keys" element={<SSHKeys />} />
            <Route path="/iso" element={<ISO />} />
            <Route path="/firewall-groups" element={<FirewallGroups />} />
            <Route path="/snapshots" element={<Snapshots />} />
            <Route path="/instances" element={<Instances />} />
          </Routes>
        </Suspense>
      </SidebarInset>
    </SidebarProvider>
  )
}
