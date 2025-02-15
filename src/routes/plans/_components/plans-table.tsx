import * as React from "react"

import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { usePlansQuery } from "@/queries/use-plans-query"
import { getColumns } from "./plans-table-columns"
import { PlansTableToolbarActions } from "./plans-table-toolbar-actions"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { TablePlan } from "@/queries/use-plans-query"

const DeletePlanDialog = React.lazy(() => import("./delete-plan-dialog"))
const UpdatePlanDialog = React.lazy(() => import("./update-plan-dialog"))

export function PlansTable() {
  const { data, error, isPending } = usePlansQuery()

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<TablePlan> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<TablePlan>[] = [
    {
      id: "plan",
      label: "Plan",
      placeholder: "Search plans..."
    }
  ]

  const { table } = useDataTable({
    data,
    columns,
    filterFields,
    debounceMs: 0,
    getRowId: (originalRow) => originalRow.id,
    initialState: {
      sorting: [{ id: "instanceCost", desc: false }],
      columnPinning: { right: ["actions"] }
    }
  })

  if (isPending) {
    return (
      <DataTableSkeleton
        shrinkZero
        columnCount={5}
        searchableColumnCount={1}
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
        withPagination={false}
      />
    )
  }

  return (
    <>
      <DataTable table={table} isStripped withPagination={false} error={error}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <PlansTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <UpdatePlanDialog
          open={rowAction?.type === "update"}
          onOpenChange={() => setRowAction(null)}
          plan={rowAction?.row.original}
        />

        <DeletePlanDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          plan={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
