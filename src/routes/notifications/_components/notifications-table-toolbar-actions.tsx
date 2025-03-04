import * as React from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { NotificationWithCount } from "@/queries/use-notifications-query"

const DeleteNotificationsDialog = React.lazy(
  () => import("./delete-notifications-dialog")
)

interface NotificationsTableToolbarActionsProps {
  table: Table<NotificationWithCount>
}

export function NotificationsTableToolbarActions({
  table
}: NotificationsTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <React.Suspense>
          <DeleteNotificationsDialog
            showTrigger
            onSuccess={() => table.toggleAllRowsSelected(false)}
            notifications={table
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
            filename: "notifications",
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
