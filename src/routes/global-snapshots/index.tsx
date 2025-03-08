import { lazy } from "react"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { SnapshotsTable } from "./_components/snapshots-table"
import { useCreateGlobalSnapshotModal } from "@/hooks/use-create-global-snapshot-modal"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

const CreateGlobalSnapshotDialog = lazy(
  () => import("./_components/create-global-snapshot-dialog")
)

export default function GlobalSnapshots() {
  const { onOpen } = useCreateGlobalSnapshotModal()

  return (
    <>
      <CreateGlobalSnapshotDialog />
      <div className="space-y-3 px-6 pb-4">
        <AppHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Global Snapshots</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppHeader>

        <div className="flex items-center justify-between gap-3">
          <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
            Global Snapshots
          </h1>
          <Button size="sm" onClick={onOpen}>
            <PlusCircle />
            New Snapshot
          </Button>
        </div>

        <SnapshotsTable />
      </div>
    </>
  )
}
