import * as React from "react"

import { useActivityLogsQuery } from "@/queries/use-activity-logs-query"
import { getColumns } from "./logs-table-columns"
import { toSentenceCase } from "@/lib/utils"
import { ACTIVITY_ACTION } from "@/types/db"
import { useDataTable } from "@/hooks/use-data-table"
import { DataTable } from "@/components/data-table"
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar"
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton"
import { LogsTableToolbarActions } from "./logs-table-toolbar-actions"

import type { Activity } from "@/types/db"
import type { DataTableFilterField } from "@/types"

export function LogsTable() {
  const { data, pageCount, error, isPending } = useActivityLogsQuery()

  const columns = React.useMemo(() => getColumns(), [])

  const filterFields: DataTableFilterField<Activity>[] = [
    {
      id: "message",
      label: "Search",
      placeholder: "Search logs..."
    },
    {
      id: "action",
      label: "Action",
      options: Object.values(ACTIVITY_ACTION).map((item) => ({
        label: toSentenceCase(item.toLowerCase()),
        value: item
      }))
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
    <DataTable table={table} error={error} isStripped>
      <DataTableToolbar table={table} filterFields={filterFields}>
        <LogsTableToolbarActions table={table} />
      </DataTableToolbar>
    </DataTable>
  )
}
