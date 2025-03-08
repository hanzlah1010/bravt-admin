import { Link } from "react-router"
import { BellPlusIcon } from "lucide-react"

import { AppHeader } from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { NotificationsTable } from "./_components/notifications-table"
import { DateRangePicker } from "@/components/date-range-picker"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function Notifications() {
  return (
    <div className="space-y-3 px-6 pb-4">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Notifications</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex items-center justify-between gap-3">
        <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
          Notifications
        </h1>
        <Button asChild size="sm">
          <Link to="/notifications/create">
            <BellPlusIcon />
            New Notification
          </Link>
        </Button>
      </div>

      <DateRangePicker
        triggerClassName="min-w-[14.5rem] w-auto ml-auto"
        align="end"
      />

      <NotificationsTable />
    </div>
  )
}
