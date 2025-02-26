import { PlusCircle, TicketIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/ui/sidebar"

export default function Tickets() {
  const { isMobile } = useSidebar()

  if (isMobile) {
    return null
  }

  return (
    <div className="hidden h-full flex-col items-center justify-center gap-2 p-4 md:flex">
      <TicketIcon className="size-8 text-muted-foreground" />
      <h1 className="text-center text-lg font-semibold text-foreground/80">
        Select a ticket or open a new one!
      </h1>
      <Button>
        <PlusCircle />
        Open Ticket
      </Button>
    </div>
  )
}
