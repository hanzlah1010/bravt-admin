import { useMemo } from "react"
import { isSameMonth, parseISO } from "date-fns"
import { CreditCard, Server, TicketCheck, Users } from "lucide-react"

import { StatCard } from "./stat-card"
import { useAnalyticsQuery } from "@/queries/use-analytics-query"
import { useInstancesQuery } from "@/queries/use-instances-query"

export function AnalyticsCards() {
  const { data: analytics, isPending: isAnalyticsPending } = useAnalyticsQuery()
  const { data: instances, isPending: isInstancesPending } = useInstancesQuery()

  const instanceStats = useMemo(() => {
    if (!instances) return { newThisMonth: 0, growthPercentage: 0, total: 0 }

    const now = new Date()
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    let newThisMonth = 0
    let lastMonthCount = 0

    instances.forEach((instance) => {
      const createdAt = parseISO(instance.date_created)

      if (isSameMonth(createdAt, now)) {
        newThisMonth++
      } else if (isSameMonth(createdAt, lastMonthDate)) {
        lastMonthCount++
      }
    })

    const growthPercentage = lastMonthCount
      ? ((newThisMonth - lastMonthCount) / lastMonthCount) * 100
      : newThisMonth > 0
        ? 100
        : 0

    return {
      newThisMonth,
      growthPercentage,
      total: instances.length
    }
  }, [instances])

  if (isAnalyticsPending) {
    return (
      <div className="flex w-full flex-wrap gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCard.Skeleton key={i} />
        ))}
      </div>
    )
  }

  if (!analytics || !instances) {
    return null
  }

  return (
    <div className="flex w-full flex-wrap gap-3">
      <StatCard
        title="Total Revenue"
        total={analytics.transactions.total}
        current={analytics.transactions.newThisMonth}
        growth={analytics.transactions.growthPercentage}
        icon={CreditCard}
        style="currency"
      />

      <StatCard
        title="Total Users"
        total={analytics.users.total}
        current={analytics.users.newThisMonth}
        growth={analytics.users.growthPercentage}
        icon={Users}
      />

      <StatCard
        title="Active Tickets"
        total={analytics.activeTickets.total}
        current={analytics.activeTickets.newThisMonth}
        growth={analytics.activeTickets.growthPercentage}
        icon={TicketCheck}
      />

      {isInstancesPending ? (
        <StatCard.Skeleton />
      ) : (
        <StatCard
          title="Instances"
          total={instanceStats.total}
          current={instanceStats.newThisMonth}
          growth={instanceStats.growthPercentage}
          icon={Server}
        />
      )}
    </div>
  )
}
