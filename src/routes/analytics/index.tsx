import Masonry from "react-masonry-css"

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

      <Masonry
        breakpointCols={{ default: 2, 1024: 1 }}
        className="gap-3 lg:flex lg:w-full"
        columnClassName="lg:first:!w-[60%] lg:last:!w-[40%]"
      >
        <UsersChart />
        <RecentTransactions />
        <TransactionsChart />
        <InstancesChart />
      </Masonry>
    </div>
  )
}
