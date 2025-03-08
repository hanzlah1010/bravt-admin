import { useState, lazy, Suspense, useMemo } from "react"
import { AlertTriangleIcon, Edit, Trash2, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"
import { getErrorMessage } from "@/lib/error"
import { useApiKeysQuery } from "@/queries/use-api-keys-query"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

import type { ApiKey } from "@/types/db"

const DeleteAPIKeyDialog = lazy(() => import("./delete-api-key-dialog"))
const UpdateAPIKeyDialog = lazy(() => import("./update-api-key-dialog"))

export function APIKeysTable() {
  const { data, error } = useApiKeysQuery(false)
  const [rowAction, setRowAction] = useState<{
    type: "delete" | "update"
    key: ApiKey
  } | null>(null)

  const hasActiveKeys = useMemo(() => data?.some((key) => key.active), [data])

  return (
    <>
      {!hasActiveKeys && (
        <div className="rounded-md border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-amber-600">
          <p className="text-sm">
            <TriangleAlert
              className="-mt-0.5 me-3 inline-flex opacity-60"
              size={16}
              aria-hidden="true"
            />
            No active api key found!
          </p>
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-6">Name</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="pr-6 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.length ? (
            data?.map((key) => (
              <TableRow key={key.id}>
                <TableCell className="pl-6 font-medium">{key.name}</TableCell>
                <TableCell className="max-w-[10rem] truncate">
                  {key.key}
                </TableCell>
                <TableCell className="flex items-center justify-end gap-2 pr-6">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    aria-label="Edit api key"
                    onClick={() => setRowAction({ type: "update", key })}
                  >
                    <Edit />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={key.active || data?.length === 1}
                    className="size-8 hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Delete api key"
                    onClick={() => setRowAction({ type: "delete", key })}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="bg-transparent hover:bg-transparent">
              <TableCell
                colSpan={3}
                className={cn("h-32 text-center", {
                  "text-destructive": !!error
                })}
              >
                {error && <AlertTriangleIcon className="mx-auto size-5" />}
                {error ? getErrorMessage(error) : "No results."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {rowAction && (
        <Suspense>
          <DeleteAPIKeyDialog
            apiKey={rowAction.key}
            open={rowAction.type === "delete"}
            onOpenChange={() => setRowAction(null)}
          />
          <UpdateAPIKeyDialog
            apiKey={rowAction.key}
            open={rowAction.type === "update"}
            onOpenChange={() => setRowAction(null)}
          />
        </Suspense>
      )}
    </>
  )
}
