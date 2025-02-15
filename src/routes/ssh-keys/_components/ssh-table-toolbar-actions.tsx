import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { VultrSSHKey } from "@/types/vultr"
import type { Resource } from "@/types/db"

interface SSHTableToolbarActionsProps {
  table: Table<VultrSSHKey & Resource>
}

export function SSHTableToolbarActions({ table }: SSHTableToolbarActionsProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        exportTableToCSV(table, {
          filename: "ssh-keys",
          excludeColumns: ["actions"]
        })
      }}
    >
      <Download className="size-4" aria-hidden="true" />
      Export
    </Button>
  )
}
