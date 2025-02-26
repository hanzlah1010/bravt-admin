import "unfonts.css"
import "@/index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"

import { App } from "@/app"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Toaster richColors />
        <QueryProvider>
          <NuqsAdapter>
            <TooltipProvider delayDuration={0}>
              <App />
            </TooltipProvider>
          </NuqsAdapter>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
