import * as React from "react"
import { Ellipsis } from "lucide-react"
import { formatDate } from "date-fns"

import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { DataTableRowAction } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import type { NotificationWithCount } from "@/queries/use-notifications-query"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<NotificationWithCount> | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<NotificationWithCount>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ cell }) => (
        <div className="max-w-[32rem] truncate">
          {cell.getValue() as string}
        </div>
      )
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ cell }) => (
        <div className="max-w-[32rem] truncate">
          {cell.getValue() as string}
        </div>
      )
    },
    {
      accessorKey: "users",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Users" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {row.original.sentToAll
            ? `All (${row.original._count.recipients})`
            : row.original._count.recipients}
        </span>
      )
    },
    {
      accessorKey: "validTill",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Valid Till" />
      ),
      cell: ({ cell }) => (
        <span className="whitespace-nowrap">
          {formatDate(cell.getValue() as Date, "PP")}
        </span>
      )
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => (
        <span className="whitespace-nowrap">
          {formatDate(cell.getValue() as Date, "PP hh:mm aa")}
        </span>
      )
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Open menu"
                variant="ghost"
                className="flex size-8 p-0 data-[state=open]:bg-muted"
              >
                <Ellipsis className="size-4" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "update" })}
              >
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={() => setRowAction({ row, type: "delete" })}
                className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              >
                Delete
                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      size: 40
    }
  ]
}
