import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon } from "lucide-react"

import type { PropsWithChildren } from "react"

export function AppHeader({ children }: PropsWithChildren) {
  const { setTheme, resolvedTheme } = useTheme()

  return (
    <header className="flex w-full items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger />
        {children}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </header>
  )
}
