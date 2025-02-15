import { toSentenceCase } from "@/lib/utils"

import type { Table } from "@tanstack/react-table"

export function exportTableToCSV<TData>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | "select" | "actions")[]

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean
  } = {}
): void {
  const { filename = "table", excludeColumns = [], onlySelected = false } = opts

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()
    .map((column) => column.id)
    .filter((id) => !excludeColumns.includes(id as keyof TData))

  const stringifyValue = (value: unknown): string => {
    if (value === null || value === undefined) {
      return ""
    }
    if (typeof value === "object") {
      // Handle Date objects
      if (value instanceof Date) {
        return value.toISOString()
      }
      // Handle arrays and objects
      try {
        return JSON.stringify(value)
      } catch {
        return "[Complex Object]"
      }
    }
    // Handle basic types
    return String(value)
  }

  // Build CSV content
  const csvContent = [
    headers.map(toSentenceCase).join(","),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map((row) =>
      headers
        .map((header) => {
          const cellValue = row.getValue(header)
          const stringValue = stringifyValue(cellValue)

          // Handle values that might contain commas or newlines
          //   return typeof cellValue === "string"
          //     ? `"${cellValue.replace(/"/g, '""')}"`
          //     : cellValue
          // })
          // .join(",")
          return stringValue.includes(",") ||
            stringValue.includes("\n") ||
            stringValue.includes('"')
            ? `"${stringValue.replace(/"/g, '""')}"`
            : stringValue
        })
        .join(",")
    )
  ].join("\n")

  // Create a Blob with CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
