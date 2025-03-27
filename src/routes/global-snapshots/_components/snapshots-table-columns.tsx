import { formatDate } from "date-fns"
import { Ellipsis } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatBytesToGB, toSentenceCase } from "@/lib/utils"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { ColumnDef } from "@tanstack/react-table"
import type { GlobalSnapshot } from "@/types/db"
import type { VultrSnapshot } from "@/types/vultr"
import type { DataTableRowAction } from "@/types"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<
      VultrSnapshot & GlobalSnapshot
    > | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<VultrSnapshot & GlobalSnapshot>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {row.original.iconUrl && (
            <img
              src={row.original.iconUrl}
              alt={row.original.name}
              className="size-full max-h-6 max-w-6 object-contain"
            />
          )}
          <span className="font-medium">{row.original.name}</span>
        </div>
      )
    },
    {
      accessorKey: "version",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Version" />
      ),
      cell: ({ row }) => <span>{row.original.version}</span>
    },
    {
      accessorKey: "username",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Username" />
      ),
      cell: ({ row }) => <span>{row.original.username}</span>
    },
    {
      accessorKey: "password",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Password" />
      ),
      cell: ({ row }) => <span>{row.original.password}</span>
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Description" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[32rem] overflow-hidden">
          <span className="truncate">{row.original.description}</span>
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
          {formatBytesToGB(row.original.compressed_size)}
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
      ),
      size: 40
    }
  ]
}
