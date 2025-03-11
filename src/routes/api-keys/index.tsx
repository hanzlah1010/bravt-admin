import { lazy, Suspense } from "react"
import { PlusCircleIcon } from "lucide-react"
import { parseAsStringEnum, useQueryState } from "nuqs"

import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-header"
import { useCreateAPIKeyModal } from "@/hooks/use-create-api-key-modal"
import { APIKeysTable } from "./_components/vultr/api-keys-table"
import { PaymentKeysTable } from "./_components/payment/payment-keys-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

const CreatePaymentKeyDialog = lazy(
  () => import("./_components/payment/create-payment-key-dialog")
)

export default function ApiKeys() {
  const onOpen = useCreateAPIKeyModal((s) => s.onOpen)

  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsStringEnum(["vultr", "payment"]).withDefault("vultr")
  )

  return (
    <>
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

        <Tabs
          value={activeTab}
          onValueChange={(s) => setActiveTab(s as "vultr" | "payment")}
        >
          <TabsList className="grid w-full grid-cols-2 md:max-w-[250px]">
            <TabsTrigger value="vultr">Vultr</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="vultr" className="mt-8 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
                Vultr Keys
              </h1>
              <Button size="sm" onClick={() => onOpen("VULTR")}>
                <PlusCircleIcon />
                New Key
              </Button>
            </div>

            <APIKeysTable />
          </TabsContent>

          <TabsContent value="payment" className="mt-8 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
                Payment Keys
              </h1>
              <Button size="sm" onClick={() => onOpen("PAYMENT")}>
                <PlusCircleIcon />
                New Key
              </Button>
            </div>

            <PaymentKeysTable />
          </TabsContent>
        </Tabs>
      </div>

      <Suspense>
        <CreatePaymentKeyDialog />
      </Suspense>
    </>
  )
}
