import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "relative shrink-0 opacity-[0.65] animate-spin border-2 border-t-transparent border-x-current border-b-current rounded-full",
  {
    variants: {
      size: {
        default: "size-[18px]",
        sm: "size-4",
        lg: "size-6"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ animationDuration: "0.4s" }}
        className={cn(spinnerVariants({ size, className }))}
        {...props}
      />
    )
  }
)

Spinner.displayName = "Spinner"

export { Spinner }
