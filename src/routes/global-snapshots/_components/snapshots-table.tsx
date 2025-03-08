import * as React from "react"

import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { useDataTable } from "@/hooks/use-data-table"
import { getColumns } from "./snapshots-table-columns"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { SnapshotsTableToolbarActions } from "./snapshots-table-toolbar-actions"
import { useGlobalSnapshotsQuery } from "@/queries/use-global-snapshots-query"

import type { Resource } from "@/types/db"
import type { VultrSnapshot } from "@/types/vultr"
import type { DataTableFilterField, DataTableRowAction } from "@/types"

const DeleteSnapshotDialog = React.lazy(
  () => import("./delete-snapshot-dialog")
)

export function SnapshotsTable() {
  const { data, error, isPending } = useGlobalSnapshotsQuery()

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    VultrSnapshot & Resource
  > | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<VultrSnapshot & Resource>[] = [
    {
      id: "description",
      label: "Description",
      placeholder: "Search snapshots..."
    },
    {
      id: "status",
      label: "Status",
      options: [
        {
          label: "Pending",
          value: "pending"
        },
        {
          label: "Complete",
          value: "complete"
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
      <DataTable table={table} isStripped withPagination={false} error={error}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <SnapshotsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <DeleteSnapshotDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          snapshot={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
