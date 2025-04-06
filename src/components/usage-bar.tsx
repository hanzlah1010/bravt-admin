import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface UsageBarProps {
  current: number
  limit: number
  label: string
  className?: string
}

export function UsageBar({ current, limit, label, className }: UsageBarProps) {
  const percentage = useMemo(
    () => Math.min((current / Math.max(limit, 1)) * 100, 100),
    [current, limit]
  )

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {current} / {limit}
        </span>
      </div>
      <Progress
        value={percentage}
        className="h-2 bg-muted"
        indicatorClassName={cn(
          "bg-emerald-500",
          percentage > 90 && "bg-red-500",
          percentage > 70 && "bg-amber-500"
        )}
      />
    </div>
  )
}
