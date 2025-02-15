import * as React from "react"

import { useTransactionsQuery } from "@/queries/use-transactions-query"
import { getColumns } from "./transactions-table-columns"
import { PAYMENT_METHOD, PAYMENT_STATUS, type Transaction } from "@/types/db"
import { toSentenceCase } from "@/lib/utils"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { TransactionsTableToolbarActions } from "./transactionss-table-toolbar-actions"

import type { DataTableFilterField, DataTableRowAction } from "@/types"

const DeleteTransactionsDialog = React.lazy(
  () => import("./delete-transactions-dialog")
)

export function TransactionsTable() {
  const { data, pageCount, error, isPending } = useTransactionsQuery()

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<Transaction> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<Transaction>[] = [
    {
      id: "amount",
      label: "Search",
      placeholder: "Search transactions..."
    },
    {
      id: "status",
      label: "Status",
      options: Object.values(PAYMENT_STATUS).map((item) => ({
        label: toSentenceCase(item.toLowerCase()),
        value: item
      }))
    },
    {
      id: "method",
      label: "Method",
      options: Object.values(PAYMENT_METHOD).map((item) => ({
        label: toSentenceCase(item.toLowerCase()),
        value: item
      }))
    }
  ]

  const { table } = useDataTable({
    data,
    columns,
    filterFields,
    pageCount,
    getRowId: (originalRow) => originalRow.id,
    initialState: {
      sorting: [{ id: "createdAt", desc: true }],
      columnPinning: { right: ["actions"], left: ["select"] }
    }
  })

  if (isPending) {
    return (
      <DataTableSkeleton
        shrinkZero
        columnCount={5}
        searchableColumnCount={1}
        filterableColumnCount={2}
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
      />
    )
  }

  return (
    <>
      <DataTable table={table} error={error}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <TransactionsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <DeleteTransactionsDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          transactions={
            rowAction?.row.original ? [rowAction.row.original] : undefined
          }
        />
      </React.Suspense>
    </>
  )
}
