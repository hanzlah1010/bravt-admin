import { formatDate } from "date-fns"

import { Badge } from "@/components/ui/badge"
import {
  cn,
  formatPrice,
  isInstanceInstalling,
  toSentenceCase
} from "@/lib/utils"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"

import type { ColumnDef } from "@tanstack/react-table"
import type { Resource } from "@/types/db"
import type { VultrInstance } from "@/types/vultr"
import { Spinner } from "@/components/ui/spinner"

export function getColumns(): ColumnDef<VultrInstance & Resource>[] {
  return [
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Label" />
      ),
      cell: ({ row }) => (
        <div
          className={cn("max-w-[32rem] overflow-hidden truncate", {
            "italic text-muted-foreground": !row.original.label
          })}
        >
          {row.original.label || "N/A"}
        </div>
      )
    },
    {
      accessorKey: "hostname",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hostname" />
      ),
      cell: ({ row }) => (
        <div
          className={cn("max-w-[32rem] overflow-hidden truncate", {
            "italic text-muted-foreground": !row.original.hostname
          })}
        >
          {row.original.hostname || "N/A"}
        </div>
      )
    },
    {
      accessorKey: "power_status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const { power_status } = row.original
        const isInstalling = isInstanceInstalling(row.original)
        return (
          <Badge
            variant={
              isInstalling
                ? "info"
                : power_status === "running"
                  ? "success"
                  : "destructive"
            }
          >
            {isInstalling ? (
              <>
                <Spinner size="xs" className="mr-1.5" />
                Installing
              </>
            ) : (
              toSentenceCase(power_status.toLowerCase())
            )}
          </Badge>
        )
      }
    },
    {
      accessorKey: "creditsConsumed",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Credits Consumed" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap">
          {formatPrice(row.original.creditsConsumed)}
        </span>
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
    }
  ]
}
