import { AppHeader } from "@/components/app-header"
import { DateRangePicker } from "@/components/date-range-picker"
import { FirewallsTable } from "./_components/firewalls-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function FirewallGroups() {
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
              <BreadcrumbPage>Firewall Groups</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
          Firewall Groups
        </h1>
        <DateRangePicker triggerClassName="min-w-[14.5rem]" align="end" />
      </div>

      <FirewallsTable />
    </div>
  )
}
