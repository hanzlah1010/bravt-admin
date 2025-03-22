import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useTransactionsStatsQuery } from "@/queries/use-transactions-stats-query"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"

import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  totalAmount: {
    label: "Total",
    color: "hsl(var(--primary))"
  }
} satisfies ChartConfig

export function TransactionsChart() {
  const [year, setYear] = useState(new Date().getFullYear())

  const { data } = useTransactionsStatsQuery(year)

  return (
    <Card className="mb-3">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Successful transactions during year {year}</CardTitle>
          <CardDescription>
            Showing the payments received for each month of the year
          </CardDescription>
        </div>
        <Select
          value={`${year}`}
          onValueChange={(y) => setYear(parseInt(y, 10))}
        >
          <SelectTrigger className="w-fit gap-2">
            <SelectValue placeholder="Year">{year}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {data.availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart accessibilityLayer data={data.transactionsData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
            />

            <defs>
              <linearGradient id="fillAmt" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalAmount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalAmount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Area
              dataKey="totalAmount"
              type="natural"
              fill="url(#fillAmt)"
              fillOpacity={0.4}
              stroke="var(--color-totalAmount)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
