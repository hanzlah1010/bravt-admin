import * as React from "react"

import { getColumns } from "./firewalls-table-columns"
import { useFirewallGroupsQuery } from "@/queries/use-firewall-groups-query"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { FirewallsTableToolbarActions } from "./firewalls-table-toolbar-actions"

import type { VultrFirewallGroup } from "@/types/vultr"
import type { Resource } from "@/types/db"
import type { DataTableFilterField, DataTableRowAction } from "@/types"

const DeleteFirewallDialog = React.lazy(
  () => import("./delete-firewall-dialog")
)

export function FirewallsTable() {
  const { data, error, isPending } = useFirewallGroupsQuery()

  const [rowAction, setRowAction] = React.useState<DataTableRowAction<
    VultrFirewallGroup & Resource
  > | null>(null)

  const columns = React.useMemo(() => getColumns({ setRowAction }), [])

  const filterFields: DataTableFilterField<VultrFirewallGroup & Resource>[] = [
    {
      id: "description",
      label: "Description",
      placeholder: "Search firewall groups..."
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
          <FirewallsTableToolbarActions table={table} />
        </DataTableToolbar>
      </DataTable>

      <React.Suspense>
        <DeleteFirewallDialog
          open={rowAction?.type === "delete"}
          onOpenChange={() => setRowAction(null)}
          firewall={rowAction?.row.original}
        />
      </React.Suspense>
    </>
  )
}
