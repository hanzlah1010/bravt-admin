import { formatDate } from "date-fns"
import { Archive, ArchiveRestore } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import {
  cn,
  formatPrice,
  isInstanceInstalling,
  toSentenceCase
} from "@/lib/utils"

import type { ColumnDef } from "@tanstack/react-table"
import type { Resource } from "@/types/db"
import type { VultrInstance } from "@/types/vultr"
import type { DataTableRowAction } from "@/types"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<VultrInstance & Resource> | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<VultrInstance & Resource>[] {
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
      accessorKey: "suspended",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Suspended" />
      ),
      cell: ({ row }) =>
        row.original.suspended ? (
          <Badge variant="destructive">Suspended</Badge>
        ) : (
          <span className="italic text-muted-foreground">N/A</span>
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
          {formatDate(cell.getValue() as Date, "PP - p")}
        </span>
      )
    },
    {
      id: "suspend",
      cell: ({ row }) => {
        const suspended = !!row.original.suspended

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                aria-label={
                  suspended ? "Unsuspend instance" : "Suspend instance"
                }
                size="icon"
                variant="ghost"
                onClick={(evt) => {
                  evt.preventDefault()
                  evt.stopPropagation()
                  setRowAction({ row, type: "suspend" })
                }}
              >
                {suspended ? <ArchiveRestore /> : <Archive />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {suspended ? "Unsuspend instance" : "Suspend instance"}
            </TooltipContent>
          </Tooltip>
        )
      },
      size: 40
    }
  ]
}
