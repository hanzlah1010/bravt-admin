import { useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { useUserStatsQuery } from "@/queries/use-users-stats-query"
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
  count: {
    label: "Users",
    color: "hsl(var(--primary))"
  }
} satisfies ChartConfig

export function UsersChart() {
  const [year, setYear] = useState(new Date().getFullYear())

  const { data } = useUserStatsQuery(year)

  return (
    <Card className="mb-3">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1.5">
          <CardTitle>User joined during year {year}</CardTitle>
          <CardDescription>
            Showing the users joined for each month of the year
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
          <BarChart accessibilityLayer data={data.usersData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="monthName"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
