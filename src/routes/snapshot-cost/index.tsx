import { SnapshotCostCard } from "./_components/snapshot-cost-card"
import { AppHeader } from "@/components/app-header"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function SnapshotCost() {
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
              <BreadcrumbPage>Snapshot cost</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
        Snapshot
      </h1>
      <SnapshotCostCard />
    </div>
  )
}
