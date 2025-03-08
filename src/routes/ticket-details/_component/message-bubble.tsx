import { lazy, useState, Suspense } from "react"
import { toast } from "sonner"
import { formatDate } from "date-fns"
import { CheckCheckIcon, Copy, EllipsisVertical, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { USER_ROLE } from "@/types/db"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import type { TicketMessage } from "@/types/db"

const DeleteMessageDialog = lazy(() => import("./delete-message-dialog"))

type MessageBubbleProps = {
  message: TicketMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const isAdminMessage = message.sender.role === USER_ROLE.ADMIN

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message.message)
      toast.success("Message copied")
    } catch {
      toast.error("Failed to copy message")
    }
  }

  return (
    <>
      <li
        className={cn(
          "group/message flex w-full items-center gap-3",
          isAdminMessage ? "ml-auto flex-row-reverse" : "mr-auto flex-row"
        )}
      >
        <div className="w-fit max-w-full md:max-w-lg">
          <p
            className={cn(
              "whitespace-pre-wrap break-words rounded-lg px-3 py-1.5 text-sm font-medium md:max-w-lg",
              isAdminMessage ? "bg-primary text-primary-foreground" : "bg-muted"
            )}
          >
            {message.message}
          </p>

          <div
            className={cn("mt-1 flex items-center gap-2", {
              "justify-end": !isAdminMessage
            })}
          >
            <p className="text-xs text-muted-foreground">
              {formatDate(message.createdAt, "hh:mm aa")}
            </p>

            {isAdminMessage && (
              <CheckCheckIcon
                className={cn(
                  "size-3.5",
                  message.seen ? "text-primary" : "text-muted-foreground"
                )}
              >
                <title>
                  {message.seen
                    ? formatDate(message.seen, "PPP hh:mm aa")
                    : "Unseen"}
                </title>
              </CheckCheckIcon>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Actions menu"
              className="mb-5 size-6 shrink-0 opacity-0 transition-[colors,opacity] group-hover/message:opacity-100 data-[state=open]:bg-accent data-[state=open]:opacity-100 [&_svg]:size-3.5"
            >
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onSelect={handleCopy}>
              <Copy />
              Copy Message
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 />
              Delete Message
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </li>

      <Suspense>
        <DeleteMessageDialog
          id={message.id}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      </Suspense>
    </>
  )
}
