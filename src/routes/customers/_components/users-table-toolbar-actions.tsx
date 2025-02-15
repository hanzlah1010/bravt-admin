import * as React from "react"
import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { User } from "@/types/db"

const DeleteUsersDialog = React.lazy(() => import("./delete-users-dialog"))

interface UsersTableToolbarActionsProps {
  table: Table<User>
}

export function UsersTableToolbarActions({
  table
}: UsersTableToolbarActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0 ? (
        <React.Suspense>
          <DeleteUsersDialog
            showTrigger
            onSuccess={() => table.toggleAllRowsSelected(false)}
            users={table
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
            filename: "users",
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
