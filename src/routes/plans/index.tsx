import { lazy } from "react"
import { PlusCircleIcon } from "lucide-react"

import { AppHeader } from "@/components/app-header"
import { PlansTable } from "./_components/plans-table"
import { Button } from "@/components/ui/button"
import { usePlanModal } from "@/hooks/use-plan-modal"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

const CreatePlanDialog = lazy(() => import("./_components/create-plan-dialog"))

export default function Plans() {
  const { onOpen } = usePlanModal()

  return (
    <>
      <CreatePlanDialog />
      <div className="space-y-3 px-6 pb-4">
        <AppHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink to="/">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Plans</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </AppHeader>

        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-medium md:text-4xl">Plans</h1>
          <Button variant="outline" onClick={onOpen}>
            <PlusCircleIcon />
            Create Plan
          </Button>
        </div>

        <PlansTable />
      </div>
    </>
  )
}
