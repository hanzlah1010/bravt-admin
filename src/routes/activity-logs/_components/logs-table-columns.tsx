import { formatDate } from "date-fns"

import { toSentenceCase } from "@/lib/utils"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"

import type { ColumnDef } from "@tanstack/react-table"
import type { Activity } from "@/types/db"

export function getColumns(): ColumnDef<Activity>[] {
  return [
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => {
        const email = row.original.user?.email
        if (!email) {
          return <span className="italic text-muted-foreground">N/A</span>
        } else {
          return <span className="whitespace-nowrap">{email}</span>
        }
      }
    },
    {
      accessorKey: "action",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Action" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary" className="whitespace-nowrap">
          {toSentenceCase(row.original.action.toLowerCase())}
        </Badge>
      )
    },
    {
      accessorKey: "message",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Message" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.getValue("message")}</span>
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
    }
  ]
}
