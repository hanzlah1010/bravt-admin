import { lazy } from "react"
import { Route, Routes } from "react-router"

import { TicketsLayout } from "@/routes/tickets/layout"
import { MainLayout } from "@/components/main-layout"
import { useSessionQuery } from "@/queries/use-session-query"
import { Spinner } from "@/components/ui/spinner"
import { USER_ROLE } from "@/types/db"

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
const Tickets = lazy(() => import("@/routes/tickets"))
const TicketDetails = lazy(() => import("@/routes/ticket-details"))

export function App() {
  const { user, isPending } = useSessionQuery()

  if (isPending) {
    return (
      <div className="flex h-svh w-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (!user || user.role !== USER_ROLE.ADMIN) {
    window.location.replace(import.meta.env.VITE_CONSOLE_URL)
    return null
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
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
      </Route>

      <Route path="/tickets" element={<TicketsLayout />}>
        <Route index element={<Tickets />} />
        <Route path=":ticketId" element={<TicketDetails />} />
      </Route>
    </Routes>
  )
}
