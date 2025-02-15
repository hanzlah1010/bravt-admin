import "@/index.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"

import { App } from "@/app"
import { ThemeProvider } from "@/providers/theme-provider"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Toaster richColors />
        <QueryProvider>
          <NuqsAdapter>
            <App />
          </NuqsAdapter>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
