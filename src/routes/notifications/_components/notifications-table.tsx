import * as React from "react"

import { DataTable } from "@/components/data-table"
import { useNotificationsQuery } from "@/queries/use-notifications-query"
import { getColumns } from "./notifications-table-columns"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { NotificationsTableToolbarActions } from "./notifications-table-toolbar-actions"

import type { DataTableFilterField, DataTableRowAction } from "@/types"
import type { NotificationWithCount } from "@/queries/use-notifications-query"

const DeleteNotificationsDialog = React.lazy(
  () => import("./delete-notifications-dialog")
)
const UpdateNotificationDialog = React.lazy(
  () => import("./update-notification-dialog")
)

export function NotificationsTable() {
  const { data, pageCount, error, isPending } = useNotificationsQuery()

  const [rowAction, setRowAction] =
    React.useState<DataTableRowAction<NotificationWithCount> | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<NotificationWithCount>[] = [
    {
      id: "title",
      label: "Search",
      placeholder: "Search notifications..."
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
        cellWidths={["8rem", "12rem", "12rem", "12rem", "8rem"]}
      />
    )
  }

  return (
    <>
      <DataTable table={table} error={error}>
        <DataTableToolbar table={table} filterFields={filterFields}>
          <NotificationsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <DeleteNotificationsDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          notifications={
            rowAction?.row.original ? [rowAction.row.original] : undefined
          }
        />
        <UpdateNotificationDialog
          open={rowAction?.type === "update"}
          onOpenChange={() => setRowAction(null)}
          notification={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
