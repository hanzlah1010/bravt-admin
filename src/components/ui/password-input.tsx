import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useImperativeHandle(ref, () => inputRef.current!)

  const toggleVisibility = () => {
    const input = inputRef.current
    if (input) {
      const start = input.selectionStart
      const end = input.selectionEnd
      setShowPassword((prev) => !prev)
      setTimeout(() => {
        input.setSelectionRange(start, end)
        input.focus()
      }, 0)
    }
  }

  return (
    <div className="relative h-10">
      <Input
        ref={inputRef}
        placeholder="••••••••••"
        type={showPassword ? "text" : "password"}
        className={cn("pr-8", className)}
        autoComplete="off"
        aria-autocomplete="none"
        {...props}
      />
      {props.value && (
        <button
          type="button"
          onClick={toggleVisibility}
          tabIndex={-1}
          className="absolute right-0 top-0 size-7 h-full bg-transparent text-muted-foreground transition-colors hover:text-foreground"
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </button>
      )}
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
