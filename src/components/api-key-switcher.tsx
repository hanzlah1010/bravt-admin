import { lazy, Suspense } from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import logo from "@/assets/logo.png"
import { useApiKeysQuery } from "@/queries/use-api-keys-query"
import { useCreateAPIKeyModal } from "@/hooks/use-create-api-key-modal"
import { useActiveAPIKey } from "@/hooks/use-active-api-key"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"

const CreateAPIKeyDialog = lazy(
  () => import("@/routes/api-keys/_components/create-api-key-dialog")
)

export function APIKeySwitcher() {
  const onCreate = useCreateAPIKeyModal((s) => s.onOpen)
  const { data } = useApiKeysQuery(false)
  const { isMobile } = useSidebar()
  const { activeKey, setActiveKey } = useActiveAPIKey()

  return (
    <>
      <Suspense>
        <CreateAPIKeyDialog />
      </Suspense>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  <img src={logo} className="size-6 shrink-0" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {activeKey?.name}
                  </span>
                  <span className="truncate text-xs">{activeKey?.key}</span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              sideOffset={4}
              side={isMobile ? "bottom" : "right"}
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            >
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                API Keys
              </DropdownMenuLabel>
              {data?.map((key) => (
                <DropdownMenuItem
                  key={key.id}
                  className="gap-2 p-2"
                  onClick={() => setActiveKey(key.id)}
                >
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <img src={logo} className="size-4 shrink-0" />
                  </div>
                  <div>
                    {key.name}
                    <p className="text-[11px] text-muted-foreground">
                      {key.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                  {key.id === activeKey?.id && (
                    <div className="ml-auto aspect-square size-2 animate-pulse rounded-full bg-success-foreground" />
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />

              <DropdownMenuItem className="gap-2 p-2" onClick={onCreate}>
                <div className="flex size-6 items-center justify-center rounded-md border bg-popover">
                  <Plus className="size-4" />
                </div>
                <div className="font-medium text-muted-foreground">
                  Add API Key
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </>
  )
}
