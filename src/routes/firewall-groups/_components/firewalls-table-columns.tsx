import { formatDate } from "date-fns"
import { Ellipsis } from "lucide-react"

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { ColumnDef } from "@tanstack/react-table"
import type { Resource } from "@/types/db"
import type { VultrFirewallGroup } from "@/types/vultr"
import type { DataTableRowAction } from "@/types"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<
      VultrFirewallGroup & Resource
    > | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<VultrFirewallGroup & Resource>[] {
  return [
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
      accessorKey: "instance_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instances" />
      )
    },
    {
      accessorKey: "rule_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Rules" />
      )
    },
    {
      accessorKey: "max_rule_count",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Max rules" />
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
              asChild
              onSelect={() => setRowAction({ row, type: "update" })}
            >
              <a
                href={`${import.meta.env.VITE_CONSOLE_URL}/firewall/${row.original.id}`}
              >
                View Details
              </a>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              onSelect={() => setRowAction({ row, type: "delete" })}
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
