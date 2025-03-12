import { AppHeader } from "@/components/app-header"
import { AnalyticsCards } from "./_components/analytics-cards"
import { UsersChart } from "./_components/users-chart"
import { RecentTransactions } from "./_components/recent-transactions"
import { TransactionsChart } from "./_components/transactions-chart"
import { InstancesChart } from "./_components/instances-chart"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage
} from "@/components/ui/breadcrumb"

export default function Analytics() {
  return (
    <div className="space-y-3 px-6 pb-4">
      <AppHeader>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </AppHeader>

      <AnalyticsCards />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.6fr_0.4fr]">
        <UsersChart />
        <RecentTransactions />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.6fr_0.4fr]">
        <TransactionsChart />
        <InstancesChart />
      </div>
    </div>
  )
}
