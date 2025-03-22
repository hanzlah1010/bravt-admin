import { ArrowDown, ArrowUp } from "lucide-react"

import { cn, formatPrice } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { NumberTicker } from "@/components/ui/number-ticker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import type { LucideIcon } from "lucide-react"

type StatCardProps = {
  title: string
  icon: LucideIcon
  total: number
  current: number
  growth: number
  style?: keyof Intl.NumberFormatOptionsStyleRegistry
}

export function StatCard({
  title,
  total,
  growth,
  current,
  style = "decimal",
  icon: Icon
}: StatCardProps) {
  const isPositive = growth > 0

  return (
    <Card className="relative grow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="whitespace-nowrap text-sm font-medium text-muted-foreground">
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
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="whitespace-nowrap text-xs text-muted-foreground">
            {formatPrice(current, 2, style)} this month
          </p>
          <div
            className={cn(
              "flex items-center gap-0.5 whitespace-nowrap text-xs font-medium",
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
    <Card className="relative grow overflow-hidden">
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
