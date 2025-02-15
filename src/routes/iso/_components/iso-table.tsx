import * as React from "react"

import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { getColumns } from "./iso-table-columns"
import { ISOTableToolbarActions } from "./iso-table-toolbar-actions"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { useISOsQuery } from "@/queries/use-isos-query"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { VultrISO } from "@/types/vultr"
import type { Resource } from "@/types/db"

const DeleteISODialog = React.lazy(() => import("./delete-iso-dialog"))

export function ISOTable() {
  const { data, error, isPending } = useISOsQuery()

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    VultrISO & Resource
  > | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<VultrISO & Resource>[] = [
    {
      id: "filename",
      label: "Filename",
      placeholder: "Search isos..."
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
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
        withPagination={false}
      />
    )
  }

  return (
    <>
      <DataTable table={table} isStripped withPagination={false} error={error}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <ISOTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <DeleteISODialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          iso={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
