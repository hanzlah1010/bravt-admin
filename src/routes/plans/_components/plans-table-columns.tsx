import * as React from "react"
import { Ellipsis } from "lucide-react"
import { formatDate } from "date-fns"

import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { DataTableRowAction } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"
import type { TablePlan } from "@/queries/use-plans-query"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<TablePlan> | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<TablePlan>[] {
  return [
    {
      accessorKey: "plan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-medium">
          {row.getValue("plan")}
        </span>
      ),
      enableHiding: false
    },
    {
      accessorKey: "instanceCost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Instance Cost" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium">
              {formatPrice(row.original.monthlyCost)}/mo
            </span>
            <span className="text-xs text-muted-foreground">
              {formatPrice(row.original.instanceCost)}/hr
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "actualCost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Actual Cost" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium">
              {formatPrice(row.original.monthly_cost)}/mo
            </span>
            <span className="text-xs text-muted-foreground">
              {formatPrice(row.original.actualCost)}/hr
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "backupCost",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Backup Cost" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium">
              {formatPrice(Number(row.original.backupCost) * 24 * 30)}/mo
            </span>
            <span className="text-xs text-muted-foreground">
              {formatPrice(row.original.backupCost)}/hr
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "promotionalPrice",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Promotional Price" />
      ),
      cell: ({ row }) => {
        if (!row.original.promotionalPrice) {
          return <p className="text-sm italic text-muted-foreground">N/A</p>
        }

        return (
          <div className="flex flex-col space-y-0.5">
            <span className="text-sm font-medium">
              {formatPrice(Number(row.original.promotionalPrice) * 24 * 30)}/mo
            </span>
            <span className="text-xs text-muted-foreground">
              {formatPrice(row.original.promotionalPrice)}/hr
            </span>
          </div>
        )
      }
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created At" />
      ),
      cell: ({ cell }) => (
        <span className="whitespace-nowrap">
          {formatDate(cell.getValue() as Date, "PPP")}
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
