import * as React from "react"

import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { useDataTable } from "@/hooks/use-data-table"
import { getColumns } from "./users-table-columns"
import { UsersTableToolbarActions } from "./users-table-toolbar-actions"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { useUsersQuery } from "@/queries/use-users-query"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { User } from "@/types/db"

const UpdateUserDialog = React.lazy(() => import("./update-user-dialog"))
const DeleteUsersDialog = React.lazy(() => import("./delete-users-dialog"))
const SuspendUserDialog = React.lazy(() => import("./suspend-user-dialog"))
const ImpersonateUserDialog = React.lazy(
  () => import("./impersonate-user-dialog")
)

export function UsersTable() {
  const { data, pageCount, error, isPending } = useUsersQuery()

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<User> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<User>[] = [
    {
      id: "firstName",
      label: "Name",
      placeholder: "Search users..."
    },
    {
      id: "isSubscribed",
      label: "Subscribed",
      options: [
        {
          value: "true",
          label: "Subscribed"
        },
        {
          value: "false",
          label: "Not Subscribed"
        }
      ]
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
        filterableColumnCount={1}
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
      />
    )
  }

  return (
    <>
      <DataTable table={table} error={error}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <UsersTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <DeleteUsersDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          users={rowAction?.row.original ? [rowAction.row.original] : undefined}
        />
        <ImpersonateUserDialog
          open={rowAction?.type === "impersonate"}
          onOpenChange={() => setRowAction(null)}
          user={rowAction?.row.original}
        />
        <UpdateUserDialog
          open={rowAction?.type === "update"}
          onOpenChange={() => setRowAction(null)}
          user={rowAction?.row.original}
        />
        <SuspendUserDialog
          open={rowAction?.type === "suspend"}
          onOpenChange={() => setRowAction(null)}
          user={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
