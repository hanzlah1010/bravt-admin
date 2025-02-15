import * as React from "react"

import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { getColumns } from "./ssh-table-columns"
import { SSHTableToolbarActions } from "./ssh-table-toolbar-actions"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { useSSHKeysQuery } from "@/queries/use-ssh-keys-query"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { VultrSSHKey } from "@/types/vultr"
import type { Resource } from "@/types/db"

const DeleteSSHKeyDialog = React.lazy(() => import("./delete-ssh-dialog"))
const UpdateSSHKeyDialog = React.lazy(() => import("./update-ssh-dialog"))

export function SSHTable() {
  const { data, error, isPending } = useSSHKeysQuery()

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    VultrSSHKey & Resource
  > | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<VultrSSHKey & Resource>[] = [
    {
      id: "name",
      label: "Name",
      placeholder: "Search ssh keys..."
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
          <SSHTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <UpdateSSHKeyDialog
          open={rowAction?.type === "update"}
          onOpenChange={() => setRowAction(null)}
          sshKey={rowAction?.row.original}
        />

        <DeleteSSHKeyDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          sshKey={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
