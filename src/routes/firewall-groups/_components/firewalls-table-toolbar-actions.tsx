import { Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { exportTableToCSV } from "@/lib/export"

import type { Table } from "@tanstack/react-table"
import type { VultrFirewallGroup } from "@/types/vultr"
import type { Resource } from "@/types/db"

interface FirewallsTableToolbarActionsProps {
  table: Table<VultrFirewallGroup & Resource>
}

export function FirewallsTableToolbarActions({
  table
}: FirewallsTableToolbarActionsProps) {
  return (
    <Button
      size="sm"
      variant="outline"
      onClick={() => {
        exportTableToCSV(table, {
          filename: "firewall-groups",
          excludeColumns: ["actions"]
        })
      }}
    >
      <Download className="size-4" aria-hidden="true" />
      Export
    </Button>
  )
}
