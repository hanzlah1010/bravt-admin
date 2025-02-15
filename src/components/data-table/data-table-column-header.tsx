import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { Column } from "@tanstack/react-table"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex w-fit shrink-0 items-center gap-2 overflow-hidden whitespace-nowrap rounded-md border-none text-sm font-medium hover:text-accent-foreground focus-visible:text-foreground focus-visible:outline-none data-[state=open]:text-foreground"
          aria-label={
            column.getIsSorted() === "desc"
              ? "Sorted descending. Click to sort ascending."
              : column.getIsSorted() === "asc"
                ? "Sorted ascending. Click to sort descending."
                : "Not sorted. Click to sort ascending."
          }
        >
          {title}
          {column.getCanSort() &&
            (column.getIsSorted() === "desc" ? (
              <ArrowDown className="size-3.5" aria-hidden="true" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp className="size-3.5" aria-hidden="true" />
            ) : (
              <ChevronsUpDown className="size-3.5" aria-hidden="true" />
            ))}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <DropdownMenuRadioGroup
              value={column.getIsSorted() || undefined}
              onValueChange={(value) => {
                if (value === "asc") {
                  column.toggleSorting(false)
                } else if (value === "desc") {
                  column.toggleSorting(true)
                }
              }}
            >
              <DropdownMenuRadioItem value="asc">
                <span className="flex items-center">
                  <ArrowUp
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Asc
                </span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="desc">
                <span className="flex items-center">
                  <ArrowDown
                    className="mr-2 size-3.5 text-muted-foreground/70"
                    aria-hidden="true"
                  />
                  Desc
                </span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          )}
          {column.getCanHide() && (
            <DropdownMenuItem onSelect={() => column.toggleVisibility(false)}>
              <span className="flex items-center">
                <EyeOff
                  className="mr-2 size-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Hide
              </span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
