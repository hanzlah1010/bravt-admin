import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { Activity } from "@/types/db"

interface LogsTableToolbarActionsProps {
  table: Table<Activity>
}

export function LogsTableToolbarActions({
  table
}: LogsTableToolbarActionsProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        exportTableToCSV(table, {
          filename: "activity-logs"
        })
      }}
    >
      <Download className="size-4" aria-hidden="true" />
      Export
    </Button>
  )
}
