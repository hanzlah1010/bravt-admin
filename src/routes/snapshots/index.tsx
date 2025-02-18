import { AppHeader } from "@/components/app-header"
import { DateRangePicker } from "@/components/date-range-picker"
import { SnapshotsTable } from "./_components/snapshots-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function Snapshots() {
  return (
    <div className="space-y-3">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Snapshots</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-medium md:text-4xl">
          Snapshots
        </h1>
        <DateRangePicker triggerClassName="min-w-[14.5rem]" align="end" />
      </div>

      <SnapshotsTable />
    </div>
  )
}
