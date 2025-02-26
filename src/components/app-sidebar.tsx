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

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
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
    label: "Dashboard",
    icon: LayoutDashboardIcon,
    subItems: [
      { label: "Analytics", url: "/" },
      { label: "Plans", url: "/plans" }
    ]
  },
  {
    label: "VPS Management",
    icon: ServerIcon,
    subItems: [
      { label: "Instances", url: "/instances" },
      { label: "Snapshots", url: "/snapshots" },
      { label: "Firewalls", url: "/firewall-groups" },
      { label: "SSH Keys", url: "/ssh-keys" },
      { label: "ISO", url: "/iso" }
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

  const allPaths = useMemo(() => {
    return items.flatMap((item) => item.subItems.map((subItem) => subItem.url))
  }, [])

  if (!allPaths.includes(pathname)) {
    return null
  }

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
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
