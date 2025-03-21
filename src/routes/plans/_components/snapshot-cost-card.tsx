import { lazy, useState } from "react"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatPrice } from "@/lib/utils"
import { useSnapshotCostQuery } from "@/queries/use-snapshot-cost-query"

const UpdateSnapshotCostDialog = lazy(
  () => import("./update-snapshot-cost-dialog")
)

export function SnapshotCostCard() {
  const { data, isLoading } = useSnapshotCostQuery()
  const isEmpty = data === null || data === undefined

  const [open, setOpen] = useState(false)

  return (
    <>
      <UpdateSnapshotCostDialog
        prevCost={data}
        open={open}
        onOpenChange={setOpen}
      />
      <div className="flex w-full items-center justify-between rounded-xl bg-card px-6 py-4 text-card-foreground">
        {isLoading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <h1
            className={cn("font-serif text-3xl font-semibold", {
              "text-destructive": isEmpty
            })}
          >
            {isEmpty ? "Not Set" : formatPrice(data)}
          </h1>
        )}

        <Button onClick={() => setOpen(true)}>
          <Edit />
          Update
        </Button>
      </div>
    </>
  )
}
