import { lazy, Suspense, useState } from "react"
import { Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { cn, formatPrice } from "@/lib/utils"
import { useAffiliateCommissionQuery } from "@/queries/use-affiliate-commission-query"

const UpdateAffiliateCommissionDialog = lazy(
  () => import("./update-affiliate-commission-dialog")
)

export function AffiliateCommissionCard() {
  const { data, isLoading } = useAffiliateCommissionQuery()
  const isEmpty = data === null || data === undefined

  const [open, setOpen] = useState(false)

  return (
    <>
      <Suspense>
        <UpdateAffiliateCommissionDialog
          open={open}
          prevAmount={data}
          onOpenChange={setOpen}
        />
      </Suspense>
      <div className="flex w-full items-center justify-between rounded-xl bg-card px-6 py-4 text-card-foreground">
        {isLoading ? (
          <Skeleton className="h-9 w-28" />
        ) : (
          <h1
            className={cn("font-serif text-3xl font-semibold", {
              "text-destructive": isEmpty
            })}
          >
            {isEmpty ? "Not Set" : formatPrice(data / 100, 0, "percent")}
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
