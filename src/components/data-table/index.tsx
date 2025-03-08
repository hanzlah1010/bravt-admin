import type * as React from "react"
import { type Table as TanstackTable, flexRender } from "@tanstack/react-table"
import { AlertTriangleIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { getCommonPinningStyles } from "@/lib/data-table"
import { DataTablePagination } from "./data-table-pagination"
import { getErrorMessage } from "@/lib/error"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

interface DataTableProps<TData> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The table instance returned from useDataTable hook with pagination, sorting, filtering, etc.
   * @type TanstackTable<TData>
   */
  table: TanstackTable<TData>

  /**
   * The floating bar to render at the bottom of the table on row selection.
   * @default null
   * @type React.ReactNode | null
   * @example floatingBar={<TasksTableFloatingBar table={table} />}
   */
  floatingBar?: React.ReactNode | null

  /**
   * Weather to show pagination or not
   * @default true
   * @type boolean | undefined
   * @example withPagination={false}
   */
  withPagination?: boolean

  /**
   * Weather to show stripped table or not
   * @default false
   * @type boolean | undefined
   * @example isStripped={true}
   */
  isStripped?: boolean

  /**
   * Query error to display error state
   * @default undefined
   * @type Error | undefined
   * @example status={"pending"}
   */
  error?: Error | null

  /**
   * Event handler called when a row is clicked
   * @default undefined
   * @type (data: TData[number]) => void | undefined
   * @example onRowClick={(data) => navigate(data.id)}
   */
  onRowClick?: (data: TData) => void
}

export function DataTable<TData>({
  table,
  children,
  className,
  error,
  onRowClick,
  floatingBar = null,
  withPagination = true,
  isStripped = false,
  ...props
}: DataTableProps<TData>) {
  const hasRows = !!table.getRowModel().rows?.length

  return (
    <div
      className={cn("w-full space-y-2.5 overflow-hidden", className)}
      {...props}
    >
      {children}

      <div
        className={cn("overflow-hidden rounded-lg border border-transparent", {
          "border-border": !isStripped || !hasRows
        })}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn("bg-card hover:bg-card", {
                  "border-b-0": isStripped
                })}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn({
                        "first:pl-4": isStripped || !withPagination,
                        "first:rounded-l-lg last:rounded-r-lg":
                          isStripped && hasRows
                      })}
                      style={{
                        ...getCommonPinningStyles({ column: header.column })
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {hasRows ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn(
                    isStripped
                      ? "border-b-0 bg-background even:bg-card hover:bg-background even:hover:bg-card"
                      : "bg-background"
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      onClick={(e) => {
                        if (onRowClick) return onRowClick(row.original)
                        if (!withPagination || isStripped) return
                        if (e.target === e.currentTarget) {
                          row.toggleSelected()
                        }
                      }}
                      className={cn({
                        "cursor-pointer": !!onRowClick,
                        "first:pl-4": isStripped || !withPagination,
                        "first:rounded-l-lg last:rounded-r-lg": isStripped
                      })}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column })
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="bg-transparent hover:bg-transparent">
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className={cn("h-32 text-center", {
                    "text-destructive": !!error
                  })}
                >
                  {error && <AlertTriangleIcon className="mx-auto size-5" />}
                  {error ? getErrorMessage(error) : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-2.5">
        {withPagination ? <DataTablePagination table={table} /> : null}
        {table.getFilteredSelectedRowModel().rows.length > 0 && floatingBar}
      </div>
    </div>
  )
}
