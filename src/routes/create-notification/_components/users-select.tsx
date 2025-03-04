import * as React from "react"
import { XIcon } from "lucide-react"
import { useInfiniteQuery } from "@tanstack/react-query"

import { api } from "@/lib/api"
import { Spinner } from "@/components/ui/spinner"
import { InfiniteScroll } from "@/components/infinite-scroll"
import { FormControl } from "@/components/ui/form"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import type { User } from "@/types/db"
import type { ControllerRenderProps } from "react-hook-form"

type Field = ControllerRenderProps<{ userIds?: string[] }, "userIds">

type UsersSelectProps = {
  field: Field
  disabled: boolean
}

export function UsersSelect({ field, disabled }: UsersSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [search, setSearch] = React.useState("")

  const { data, isPending, ...query } = useInfiniteQuery({
    queryKey: ["users-select", search],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await api.get<{ pageCount: number; users: User[] }>(
        `/admin/user?page=${pageParam}${search?.trim() ? `&search=${search}` : ""}`
      )
      return data
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      const nextPage = pages.length + 1
      return nextPage <= lastPage.pageCount ? nextPage : undefined
    }
  })

  const users = React.useMemo(
    () => data?.pages.flatMap((page) => page.users) || [],
    [data]
  )

  const selectedUsers = React.useMemo(() => {
    return users.filter((user) => field.value?.includes(user.id))
  }, [users, field.value])

  const selectables = React.useMemo(() => {
    return users.filter((user) => !field.value?.includes(user.id))
  }, [users, field.value])

  function handleUnselect(userId: string) {
    const newOptions = field.value?.filter((id) => id !== userId)
    field.onChange(newOptions)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    const input = inputRef.current
    if (input && (e.key === "Delete" || e.key === "Backspace")) {
      if (input.value === "" && !!field.value?.length) {
        handleUnselect(field.value[field.value.length - 1])
      }
    }
  }

  return (
    <Popover>
      <FormControl>
        <PopoverTrigger
          disabled={disabled || isPending}
          className="flex min-h-10 w-full flex-wrap items-center gap-1 rounded-md border-2 border-input px-3 py-2 text-sm focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 data-[state=open]:border-primary"
        >
          {selectedUsers.length ? (
            selectedUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground hover:bg-secondary/80"
              >
                {user.email}
                <button
                  type="button"
                  disabled={disabled}
                  className="rounded-full outline-none hover:text-destructive"
                  onClick={(evt) => {
                    evt.stopPropagation()
                    handleUnselect(user.id)
                  }}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">
              Select Users...
            </span>
          )}
        </PopoverTrigger>
      </FormControl>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          shouldFilter={false}
          className="h-auto overflow-visible bg-transparent"
          onKeyDown={handleKeyDown}
        >
          <CommandInput
            placeholder="Search users..."
            className="h-9"
            value={search}
            onValueChange={setSearch}
          />

          <CommandList>
            <CommandEmpty className="flex w-full items-center justify-center">
              {isPending ? <Spinner size="sm" /> : "No user found."}
            </CommandEmpty>

            <CommandGroup>
              {selectables.map((user) => (
                <CommandItem
                  key={user.id}
                  disabled={disabled || isPending}
                  className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                  onSelect={() => {
                    field.onChange([...(field.value || []), user.id])
                  }}
                >
                  {user.email}
                </CommandItem>
              ))}
            </CommandGroup>
            <InfiniteScroll {...query} />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
