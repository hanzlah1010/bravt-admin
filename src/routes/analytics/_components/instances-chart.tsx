import { useMemo } from "react"
import { Label, Pie, PieChart } from "recharts"

import { isInstanceInstalling } from "@/lib/utils"
import { useInstancesQuery } from "@/queries/use-instances-query"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"

import type { ChartConfig } from "@/components/ui/chart"

const chartConfig = {
  installing: {
    label: "Installing",
    color: "hsl(var(--warning))"
  },
  running: {
    label: "Running",
    color: "hsl(var(--primary))"
  },
  stopped: {
    label: "Stopped",
    color: "hsl(var(--destructive))"
  }
} satisfies ChartConfig

export function InstancesChart() {
  const { data } = useInstancesQuery()

  const chartData = useMemo(() => {
    const counts = data.reduce(
      (acc, instance) => {
        if (isInstanceInstalling(instance)) {
          acc.installing++
        } else if (instance.power_status === "running") {
          acc.running++
        } else if (instance.power_status === "stopped") {
          acc.stopped++
        }
        return acc
      },
      { installing: 0, running: 0, stopped: 0 }
    )

    return Object.entries(counts)
      .filter(([, count]) => count > 0)
      .map(([status, count]) => ({
        status,
        count,
        fill: `var(--color-${status})`
      }))
  }, [data])

  return (
    <Card>
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle>Instances</CardTitle>
        <CardDescription>
          Displaying the total instances filtered by their status
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />

            <Pie
              dataKey="count"
              nameKey="status"
              data={chartData}
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data.length.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Instances
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
