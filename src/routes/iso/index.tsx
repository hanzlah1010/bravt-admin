import { AppHeader } from "@/components/app-header"
import { DateRangePicker } from "@/components/date-range-picker"
import { ISOTable } from "./_components/iso-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function ISO() {
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
              <BreadcrumbPage>ISO</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="font-serif text-3xl font-medium md:text-4xl">ISO</h1>
        <DateRangePicker triggerClassName="min-w-[14.5rem]" align="end" />
      </div>

      <ISOTable />
    </div>
  )
}
