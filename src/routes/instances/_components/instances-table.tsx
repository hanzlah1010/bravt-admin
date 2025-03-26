import * as React from "react"

import { DataTable } from "@/components/data-table"
import { useInstancesQuery } from "@/queries/use-instances-query"
import { getColumns } from "./instances-table-columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { InstancesTableToolbarActions } from "./instances-table-toolbar-actions"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { VultrInstance } from "@/types/vultr"
import type { Resource } from "@/types/db"

const SuspendInstanceDialog = React.lazy(
  () => import("./suspend-instance-dialog")
)

export function InstancesTable() {
  const { data, error, isPending } = useInstancesQuery()
  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    Resource & VultrInstance
  > | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<VultrInstance & Resource>[] = [
    {
      id: "label",
      label: "Label",
      placeholder: "Search instances..."
    },
    {
      id: "power_status",
      label: "Status",
      options: [
        {
          label: "Running",
          value: "running"
        },
        {
          label: "Stopped",
          value: "stopped"
        },
        {
          label: "Installing",
          value: "installing"
        }
      ]
    }
  ]

  const { table } = useDataTable({
    data,
    columns,
    filterFields,
    debounceMs: 0,
    getRowId: (originalRow) => originalRow.id,
    initialState: {
      sorting: [{ id: "date_created", desc: true }],
      columnPinning: { right: ["actions"] }
    }
  })

  if (isPending) {
    return (
      <DataTableSkeleton
        shrinkZero
        columnCount={5}
        searchableColumnCount={1}
        filterableColumnCount={1}
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
        withPagination={false}
      />
    )
  }

  return (
    <>
      <DataTable
        table={table}
        withPagination={false}
        error={error}
        onRowClick={(instance) => {
          window.open(
            `${import.meta.env.VITE_CONSOLE_URL}/instance/${instance.id}`,
            "_blank"
          )
        }}
      >
        <DataTableToolbar table={table} filterFields={filterFields}>
          <InstancesTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <SuspendInstanceDialog
          open={rowAction?.type === "suspend"}
          onOpenChange={() => setRowAction(null)}
          instance={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
