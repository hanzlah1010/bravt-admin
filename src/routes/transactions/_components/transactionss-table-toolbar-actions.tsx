import * as React from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { Transaction } from "@/types/db"

const DeleteTransactionsDialog = React.lazy(
  () => import("./delete-transactions-dialog")
)

interface TransactionsTableToolbarActionsProps {
  table: Table<Transaction>
}

export function TransactionsTableToolbarActions({
  table
}: TransactionsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <React.Suspense>
          <DeleteTransactionsDialog
            showTrigger
            onSuccess={() => table.toggleAllRowsSelected(false)}
            transactions={table
              .getFilteredSelectedRowModel()
              .rows.map((row) => row.original)}
          />
        </React.Suspense>
      ) : null}

      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          exportTableToCSV(table, {
            filename: "transactions",
            excludeColumns: ["actions", "select"]
          })
        }}
      >
        <Download className="size-4" aria-hidden="true" />
        Export
      </Button>
    </div>
  )
}
