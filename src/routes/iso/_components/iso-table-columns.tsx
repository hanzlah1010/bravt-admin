import { formatDate } from "date-fns"
import { Trash2 } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import { formatBytesToGB, toSentenceCase } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

import type { ColumnDef } from "@tanstack/react-table"
import type { Resource } from "@/types/db"
import type { VultrISO } from "@/types/vultr"
import type { DataTableRowAction } from "@/types"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<VultrISO & Resource> | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<VultrISO & Resource>[] {
  return [
    {
      accessorKey: "filename",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Filename" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[32rem] overflow-hidden">
          <span className="truncate">{row.original.filename}</span>
        </div>
      )
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatBytesToGB(row.original.size)}
        </span>
      )
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { status } = row.original
        return (
          <Badge
            variant={
              status === "pending"
                ? "primary"
                : status === "complete"
                  ? "success"
                  : "destructive"
            }
          >
            {toSentenceCase(status.toLowerCase())}
          </Badge>
        )
      }
    },
    {
      accessorKey: "md5sum",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="MD5" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[32rem] overflow-hidden">
          <span className="truncate">{row.original.md5sum}</span>
        </div>
      )
    },
    {
      accessorKey: "user",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="User" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">{row.original.user.email}</span>
      )
    },
    {
      accessorKey: "date_created",
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
      cell: ({ row }) => (
        <Button
          aria-label="Delete iso"
          size="icon"
          variant="ghost"
          onClick={() => setRowAction({ row, type: "delete" })}
        >
          <Trash2 />
        </Button>
      ),
      size: 40
    }
  ]
}
