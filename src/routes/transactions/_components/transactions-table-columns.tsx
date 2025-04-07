import * as React from "react"
import { Ellipsis } from "lucide-react"
import { formatDate } from "date-fns"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

import { formatPrice, toSentenceCase } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PAYMENT_STATUS, type Transaction } from "@/types/db"
import { api } from "@/lib/api"
import { getErrorMessage } from "@/lib/error"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { DataTableRowAction } from "@/types"
import type { ColumnDef } from "@tanstack/react-table"

interface GetColumnsProps {
  setRowAction: React.Dispatch<
    React.SetStateAction<DataTableRowAction<Transaction> | null>
  >
}

export function getColumns({
  setRowAction
}: GetColumnsProps): ColumnDef<Transaction>[] {
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
      accessorKey: "amount",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Amount" />
      ),
      cell: ({ cell }) => (
        <div className="whitespace-nowrap font-medium">
          {formatPrice(cell.getValue() as string)}
        </div>
      ),
      enableHiding: false
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
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.original.status
        return (
          <Badge
            variant={
              status === PAYMENT_STATUS.PENDING
                ? "primary"
                : status === PAYMENT_STATUS.SUCCESS
                  ? "success"
                  : status === PAYMENT_STATUS.CAPTURED
                    ? "info"
                    : "destructive"
            }
          >
            {toSentenceCase(status.toLowerCase())}
          </Badge>
        )
      }
    },
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Method" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {toSentenceCase(row.original.method.toLowerCase())}
        </Badge>
      )
    },
    {
      accessorKey: "createdAt",
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
      id: "actions",
      cell: function Cell({ row }) {
        const queryClient = useQueryClient()
        const [isUpdatePending, startUpdateTransition] = React.useTransition()

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
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={row.original.status}
                    onValueChange={(value) => {
                      if (value === row.original.status) return

                      startUpdateTransition(() => {
                        toast.promise(
                          api.patch(`/admin/transactions/${row.original.id}`, {
                            status: value
                          }),
                          {
                            loading: "Updating...",
                            success: () => {
                              queryClient.invalidateQueries({
                                queryKey: ["transactions"]
                              })
                              return "Status updated"
                            },
                            error: getErrorMessage
                          }
                        )
                      })
                    }}
                  >
                    {Object.values(PAYMENT_STATUS).map((status) => (
                      <DropdownMenuRadioItem
                        key={status}
                        value={status}
                        disabled={isUpdatePending}
                      >
                        {toSentenceCase(status.toLowerCase())}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>

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
