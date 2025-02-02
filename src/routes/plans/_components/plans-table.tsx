import * as React from "react"
import orderBy from "lodash.orderby"
import { parseAsString, useQueryStates } from "nuqs"

import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { usePlans } from "@/queries/use-plans"
import { getColumns } from "./plans-table-columns"
import { PlansTableToolbarActions } from "./plans-table-toolbar-actions"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { getSortingStateParser } from "@/lib/parsers"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { TablePlan } from "@/queries/use-plans"

const DeletePlanDialog = React.lazy(() => import("./delete-plan-dialog"))
const UpdatePlanDialog = React.lazy(() => import("./update-plan-dialog"))

export function PlansTable() {
  const [{ search, sort }] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      sort: getSortingStateParser<TablePlan>().withDefault([
        { id: "instanceCost", desc: false }
      ])
    },
    { urlKeys: { search: "plan" } }
  )

  const { plans, error, isPending } = usePlans()

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

  const handleSort = React.useCallback(
    (data: TablePlan[]) => {
      return orderBy(
        data,
        sort.map((s) => s.id),
        sort.map((s) => (s.desc ? "desc" : "asc"))
      )
    },
    [sort]
  )

  const data = React.useMemo(() => {
    if (!search?.trim()) return handleSort(plans)
    const query = search.trim().toLowerCase()
    return handleSort(
      plans.filter((plan) => {
        return (
          plan.plan.toLowerCase().trim().includes(query) ||
          plan.type.toLowerCase().includes(query) ||
          plan.id.toLowerCase().includes(query) ||
          [
            plan.monthlyCost,
            plan.monthly_cost,
            plan.instanceCost,
            plan.actualCost,
            plan.locations,
            plan.vcpu_count,
            plan.ram
          ].some((v) => String(v).includes(query))
        )
      })
    )
  }, [plans, search, handleSort])

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
      <DataTable table={table} withPagination={false} error={error}>
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
