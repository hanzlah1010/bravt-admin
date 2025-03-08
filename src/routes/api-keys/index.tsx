import { PlusCircleIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { useCreateAPIKeyModal } from "@/hooks/use-create-api-key-modal"
import { APIKeysTable } from "./_components/api-keys-table"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function ApiKeys() {
  const onOpen = useCreateAPIKeyModal((s) => s.onOpen)

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
              <BreadcrumbPage>API Keys</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <div className="flex items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-medium md:text-4xl">
          API Keys
        </h1>
        <Button size="sm" onClick={onOpen}>
          <PlusCircleIcon />
          New API Key
        </Button>
      </div>

      <APIKeysTable />
    </div>
  )
}
