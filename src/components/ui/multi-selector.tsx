import * as React from "react"
import { XIcon } from "lucide-react"
import { Command as CommandPrimitive } from "cmdk"

import { cn } from "@/lib/utils"
import { Command, CommandItem, CommandList } from "@/components/ui/command"

export interface Option {
  value: string
  label: string
  disable?: boolean
}

interface MultipleSelectorProps {
  value?: Option[]
  onChange?: (options: Option[]) => void
  options: Option[]
  placeholder?: string
  disabled?: boolean
  className?: string
  badgeClassName?: string
  inputProps?: React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
}

function MultipleSelector({
  value,
  onChange,
  placeholder,
  options,
  disabled,
  className,
  badgeClassName,
  inputProps
}: MultipleSelectorProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<Option[]>(value || [])

  const handleUnselect = (option: Option) => {
    const newOptions = selected.filter((s) => s.value !== option.value)
    setSelected(newOptions)
    onChange?.(newOptions)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const input = inputRef.current
    if (input && (e.key === "Delete" || e.key === "Backspace")) {
      if (input.value === "" && selected.length > 0) {
        handleUnselect(selected[selected.length - 1])
      }
    }
  }

  React.useEffect(() => {
    if (value) setSelected(value)
  }, [value])

  const selectables = options.filter(
    (option) => !selected.find((s) => s.value === option.value)
  )

  return (
    <Command
      shouldFilter={false}
      onKeyDown={handleKeyDown}
      className={cn("h-auto overflow-visible bg-transparent")}
    >
      <div
        className={cn(
          "relative flex min-h-[38px] items-center rounded-md border border-input px-3 py-2 text-sm focus-within:ring-[3px] focus-within:ring-ring/50",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <div
              key={option.value}
              className={cn(
                "flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-secondary-foreground hover:bg-secondary/80",
                badgeClassName
              )}
            >
              {option.label}
              <button
                type="button"
                onClick={() => handleUnselect(option)}
                disabled={disabled}
                className="rounded-full outline-none hover:text-primary focus:ring-1 focus:ring-ring"
              >
                <XIcon size={14} />
              </button>
            </div>
          ))}
          <CommandPrimitive.Input
            {...inputProps}
            ref={inputRef}
            value={inputProps?.value || ""}
            onValueChange={(value) => {
              setOpen(true)
              inputProps?.onValueChange?.(value)
            }}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="relative mt-2">
        {open && (
          <div className="absolute top-0 z-10 w-full rounded-md border border-input bg-popover shadow-md">
            <CommandList>
              {selectables.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    const newValue = [...selected, option]
                    setSelected(newValue)
                    onChange?.(newValue)
                  }}
                  disabled={option.disable || disabled}
                  className="cursor-pointer aria-selected:bg-accent aria-selected:text-accent-foreground"
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  )
}
MultipleSelector.displayName = "MultipleSelector"

export { MultipleSelector }
