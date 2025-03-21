import { AppHeader } from "@/components/app-header"
import { AffiliateCommissionCard } from "./_components/affiliate-commission-card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb"

export default function AffiliateCommission() {
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
              <BreadcrumbPage>Affiliate Commission</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <h1 className="whitespace-nowrap font-serif text-3xl font-medium md:text-4xl">
        Affiliate Commission
      </h1>

      <AffiliateCommissionCard />
    </div>
  )
}
