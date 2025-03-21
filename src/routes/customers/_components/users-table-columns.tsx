import * as React from "react"
import { Ellipsis } from "lucide-react"
import { formatDate } from "date-fns"

import { cn, formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
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
import type { User } from "@/types/db"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<User> | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<User>[] {
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
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => (
        <span
          className={cn("whitespace-nowrap font-medium", {
            "italic text-muted-foreground":
              !row.original.firstName && !row.original.lastName
          })}
        >
          {row.original.firstName || row.original.lastName ? (
            <>
              {row.original.firstName} {row.original.lastName}
            </>
          ) : (
            "N/A"
          )}
        </span>
      ),
      enableHiding: false
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ cell }) => (
        <div className="whitespace-nowrap font-medium">
          {cell.getValue() as string}
        </div>
      )
    },
    {
      accessorKey: "phoneNumber",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Phone Number" />
      ),
      cell: ({ row }) => (
        <div
          className={cn("whitespace-nowrap font-medium", {
            "italic text-muted-foreground": !row.original.phoneNumber
          })}
        >
          {row.original.phoneNumber || "N/A"}
        </div>
      )
    },
    {
      accessorKey: "credits",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Credits" />
      ),
      cell: ({ row }) => formatPrice(row.original.credits)
    },
    {
      accessorKey: "isSubscribed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Is Subscribed" />
      ),
      cell: ({ row }) =>
        row.original.isSubscribed ? (
          <Badge variant="success">Subscribed</Badge>
        ) : (
          <span className="italic text-muted-foreground">N/A</span>
        )
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Address" />
      ),
      cell: ({ row }) => {
        const { address, city, country } = row.original

        return (
          <div
            className={cn("max-w-[32rem] truncate", {
              "italic text-muted-foreground": !address && !city && !country
            })}
          >
            {address || city || country ? (
              <>
                {address}, {city}, {country}
              </>
            ) : (
              "N/A"
            )}
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
              Update
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => setRowAction({ row, type: "impersonate" })}
            >
              Impersonate
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={() => setRowAction({ row, type: "terminate" })}
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
            >
              Terminate
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
