import { useMemo } from "react"
import { isSameMonth, parseISO } from "date-fns"
import {
  ArrowDown,
  ArrowUp,
  CreditCard,
  Crown,
  Server,
  Users
} from "lucide-react"

import { cn, formatPrice } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { NumberTicker } from "@/components/ui/number-ticker"
import { useAnalyticsQuery } from "@/queries/use-analytics-query"
import { useInstancesQuery } from "@/queries/use-instances-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { LucideIcon } from "lucide-react"

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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
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
        title="Subscribed Users"
        total={analytics.subscribedUsers.total}
        current={analytics.subscribedUsers.newThisMonth}
        growth={analytics.subscribedUsers.growthPercentage}
        icon={Crown}
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

type StatCardProps = {
  title: string
  icon: LucideIcon
  total: number
  current: number
  growth: number
  style?: keyof Intl.NumberFormatOptionsStyleRegistry
}

function StatCard({
  title,
  total,
  growth,
  current,
  style = "decimal",
  icon: Icon
}: StatCardProps) {
  const isPositive = growth > 0

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 shrink-0 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <NumberTicker
          value={total}
          formatStyle={style}
          className="text-2xl font-bold"
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {formatPrice(current, 2, style)} this month
          </p>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-success-foreground" : "text-destructive"
            )}
          >
            {isPositive ? (
              <ArrowUp className="size-3.5" />
            ) : (
              <ArrowDown className="size-3.5" />
            )}
            {formatPrice(growth / 100, 2, "percent")}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

StatCard.Skeleton = () => {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="size-4 shrink-0" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-4 h-8 w-[150px]" />
        <div className="mt-4 flex items-center justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[60px]" />
        </div>
      </CardContent>
    </Card>
  )
}
