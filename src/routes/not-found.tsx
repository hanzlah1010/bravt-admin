import { Link } from "react-router"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"

export function NotFound() {
  return (
    <div className="flex h-full min-h-svh flex-col items-center justify-center text-center">
      <h1 className="text-pretty font-serif text-6xl font-bold">404</h1>
      <p className="text-lg text-muted-foreground">
        This page could not be found!
      </p>
      <Button asChild size="sm" className="group mt-2">
        <Link to="/">
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
          Go back home
        </Link>
      </Button>
    </div>
  )
}
