import { toast } from "sonner"
import { KeyRoundIcon, LogOutIcon, ShieldIcon, UserIcon } from "lucide-react"

import { api } from "@/lib/api"
import { getUserInitials } from "@/lib/utils"
import { useSessionQuery } from "@/queries/use-session-query"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export function UserMenu() {
  const { user } = useSessionQuery()

  const handleLogout = async () => {
    toast.promise(api.post("/auth/logout"), {
      success: () => {
        window.location.href = import.meta.env.VITE_CONSOLE_URL
        return "Logged out"
      },
      error: "Failed to logout"
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <Avatar>
          <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="max-w-[200px]">
        <div className="flex items-center gap-1.5">
          <Avatar>
            <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">
              {user.firstName} {user.lastName}
            </p>
            <p className="line-clamp-1 break-all text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <a
              href={`${import.meta.env.VITE_CONSOLE_URL}/profile`}
              target="_blank"
            >
              <UserIcon />
              Update Profile
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`${import.meta.env.VITE_CONSOLE_URL}/change-password`}
              target="_blank"
            >
              <KeyRoundIcon />
              Change Password
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href={`${import.meta.env.VITE_CONSOLE_URL}/security`}
              target="_blank"
            >
              <ShieldIcon />
              Security
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onSelect={handleLogout}
            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
          >
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
