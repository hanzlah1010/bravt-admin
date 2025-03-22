import { useCallback, useMemo } from "react"
import { Link, useLocation } from "react-router"
import {
  ServerIcon,
  UsersIcon,
  SettingsIcon,
  ChevronRightIcon,
  LayoutDashboardIcon,
  HeadsetIcon
} from "lucide-react"

import { APIKeySwitcher } from "./api-key-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail
} from "@/components/ui/sidebar"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "@/components/ui/collapsible"

const items = [
  {
    label: "VPS Management",
    icon: ServerIcon,
    subItems: [
      { label: "Plans", url: "/plans" },
      { label: "Snapshot Cost", url: "/snapshot-cost" },
      { label: "Instances", url: "/instances" },
      { label: "Snapshots", url: "/snapshots" },
      { label: "Firewalls", url: "/firewall-groups" },
      { label: "SSH Keys", url: "/ssh-keys" },
      { label: "ISO", url: "/iso" },
      { label: "Global Snapshots", url: "/global-snapshots" }
    ]
  },
  {
    label: "User Management",
    icon: UsersIcon,
    subItems: [
      { label: "Customers", url: "/customers" },
      { label: "Transactions", url: "/transactions" }
    ]
  },
  {
    label: "System",
    icon: SettingsIcon,
    subItems: [
      { label: "Activity Logs", url: "/activity-logs" },
      { label: "Notifications", url: "/notifications" },
      { label: "Affiliate Commission", url: "/affiliate-commission" },
      { label: "API Keys", url: "/api-keys" }
    ]
  }
]

export function AppSidebar() {
  const { pathname } = useLocation()

  const isActive = useCallback(
    (url: string) => {
      if (url === "/") {
        return pathname === "/"
      } else {
        return pathname.startsWith(url)
      }
    },
    [pathname]
  )

  const defaultActive = useMemo(() => {
    return items.findIndex((item) =>
      item.subItems.some((subItem) => isActive(subItem.url))
    )
  }, [isActive])

  return (
    <Sidebar>
      <SidebarHeader>
        <APIKeySwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link to="/">
                  <LayoutDashboardIcon />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {items.map((item, index) => (
              <Collapsible
                key={item.label}
                asChild
                className="group/collapsible"
                defaultOpen={defaultActive === index}
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <item.icon />
                      <span>{item.label}</span>
                      <ChevronRightIcon className="ml-auto !size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.subItems.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.label}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <Link to={subItem.url}>
                              <span>{subItem.label}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/tickets">
                <HeadsetIcon />
                Customer Support
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
