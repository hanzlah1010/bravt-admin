import { lazy, Suspense } from "react"
import { Route, Routes, useLocation } from "react-router"

import { USER_ROLE } from "@/types/db"
import { TicketsLayout } from "@/routes/tickets/layout"
import { MainLayout } from "@/components/main-layout"
import { SocketProvider, Sockets } from "@/providers/socket-provider"
import { NotFound } from "@/routes/not-found"
import { useSessionQuery } from "@/queries/use-session-query"
import { PageSpinner } from "@/components/page-spinner"

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
const Notifications = lazy(() => import("@/routes/notifications"))
const CreateNotification = lazy(() => import("@/routes/create-notification"))
const ApiKeys = lazy(() => import("@/routes/api-keys"))
const Impersonation = lazy(() => import("@/routes/impersonation"))
const GlobalSnapshots = lazy(() => import("@/routes/global-snapshots"))
const Login = lazy(() => import("@/routes/login"))

const LOGIN_ROUTE = "/admin-Nm5K3V2pF1L7XjQ8Y@R9Tb4Z"

export function App() {
  const { pathname } = useLocation()
  const { user, isPending } = useSessionQuery(true)

  if (isPending) {
    return <PageSpinner />
  }

  if (!user || user.role !== USER_ROLE.ADMIN) {
    if (user?.impersonatedBy) {
      return (
        <Suspense fallback={<PageSpinner />}>
          <Impersonation />
        </Suspense>
      )
    }

    if (pathname !== LOGIN_ROUTE) {
      window.location.replace(import.meta.env.VITE_CONSOLE_URL)
      return <PageSpinner />
    }
  }

  return (
    <SocketProvider>
      <Sockets />
      <Routes>
        <Route path={LOGIN_ROUTE} element={<Login />} />
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
          <Route path="/api-keys" element={<ApiKeys />} />
          <Route path="/global-snapshots" element={<GlobalSnapshots />} />
          <Route path="/notifications">
            <Route index element={<Notifications />} />
            <Route path="create" element={<CreateNotification />} />
          </Route>
        </Route>

        <Route path="/tickets" element={<TicketsLayout />}>
          <Route index element={<Tickets />} />
          <Route path=":ticketId" element={<TicketDetails />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </SocketProvider>
  )
}
