import { useState, lazy, Suspense } from "react"
import { AlertTriangleIcon, Trash2 } from "lucide-react"

import { cn, toSentenceCase } from "@/lib/utils"
import { getErrorMessage } from "@/lib/error"
import { Button } from "@/components/ui/button"
import { usePaymentKeysQuery } from "@/queries/use-payment-keys-query"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import type { PaymentKey } from "@/types/db"

const DeletePaymentKeyDialog = lazy(() => import("./delete-payment-key-dialog"))

export function PaymentKeysTable() {
  const { data, error, isPending } = usePaymentKeysQuery()
  const [rowAction, setRowAction] = useState<{
    type: "delete"
    key: PaymentKey
  } | null>(null)

  if (isPending) {
    return (
      <DataTableSkeleton
        shrinkZero
        columnCount={5}
        searchableColumnCount={0}
        filterableColumnCount={0}
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
      />
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Method</TableHead>
            <TableHead>Client Id</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data?.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="pl-6 font-medium">
                  {toSentenceCase(key.type.toLowerCase())}
                </TableCell>
                <TableCell className="max-w-[10rem] truncate">
                  {key.clientId}
                </TableCell>
                <TableCell className="flex justify-end pr-6">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete payment key"
                    onClick={() => setRowAction({ type: "delete", key })}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell
                colSpan={3}
                className={cn("h-32 text-center", {
                  "text-destructive": !!error
                })}
              >
                {error && <AlertTriangleIcon className="mx-auto size-5" />}
                {error ? getErrorMessage(error) : "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rowAction && (
        <Suspense>
          <DeletePaymentKeyDialog
            paymentKey={rowAction.key}
            open={rowAction.type === "delete"}
            onOpenChange={() => setRowAction(null)}
          />
        </Suspense>
      )}
    </>
  )
}
