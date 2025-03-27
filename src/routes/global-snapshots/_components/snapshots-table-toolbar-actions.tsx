import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { VultrSnapshot } from "@/types/vultr"
import type { GlobalSnapshot } from "@/types/db"

interface SnapshotsTableToolbarActionsProps {
  table: Table<VultrSnapshot & GlobalSnapshot>
}

export function SnapshotsTableToolbarActions({
  table
}: SnapshotsTableToolbarActionsProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        exportTableToCSV(table, {
          filename: "snapshots",
          excludeColumns: ["actions"]
        })
      }}
    >
      <Download className="size-4" aria-hidden="true" />
      Export
    </Button>
  )
}
