import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { VultrISO } from "@/types/vultr"
import type { Resource } from "@/types/db"

interface ISOTableToolbarActionsProps {
  table: Table<VultrISO & Resource>
}

export function ISOTableToolbarActions({ table }: ISOTableToolbarActionsProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        exportTableToCSV(table, {
          filename: "iso",
          excludeColumns: ["actions"]
        })
      }}
    >
      <Download className="size-4" aria-hidden="true" />
      Export
    </Button>
  )
}
