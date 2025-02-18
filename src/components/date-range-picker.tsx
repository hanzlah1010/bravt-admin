import * as React from "react"
import { endOfDay, format, startOfDay } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { parseAsString, useQueryStates } from "nuqs"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"

import type { DateRange } from "react-day-picker"
import type { ButtonProps } from "@/components/ui/button"

interface DateRangePickerProps
  extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  /**
   * The selected date range.
   * @default undefined
   * @type DateRange
   * @example { from: new Date(), to: new Date() }
   */
  defaultDateRange?: DateRange

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The variant of the calendar trigger button.
   * @default "outline"
   * @type "default" | "outline" | "secondary" | "ghost"
   */
  triggerVariant?: Exclude<ButtonProps["variant"], "destructive" | "link">

  /**
   * The size of the calendar trigger button.
   * @default "default"
   * @type "default" | "sm" | "lg"
   */
  triggerSize?: Exclude<ButtonProps["size"], "icon">

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  triggerClassName?: string

  /**
   * Controls whether query states are updated client-side only (default: true).
   * Setting to `false` triggers a network request to update the querystring.
   * @default true
   */
  shallow?: boolean
}

export function DateRangePicker({
  defaultDateRange,
  placeholder = "Pick a date",
  triggerVariant = "outline",
  triggerSize = "sm",
  triggerClassName,
  shallow = true,
  className,
  ...props
}: DateRangePickerProps) {
  const [dateParams, setDateParams] = useQueryStates(
    {
      from: parseAsString.withDefault(
        defaultDateRange?.from?.toISOString() ?? ""
      ),
      to: parseAsString.withDefault(defaultDateRange?.to?.toISOString() ?? "")
    },
    {
      clearOnDefault: true,
      shallow
    }
  )

  const date = React.useMemo(() => {
    function parseDate(dateString: string | null) {
      if (!dateString) return undefined
      const parsedDate = new Date(dateString)
      return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate
    }

    return {
      from: parseDate(dateParams.from) ?? defaultDateRange?.from,
      to: parseDate(dateParams.to) ?? defaultDateRange?.to
    }
  }, [dateParams, defaultDateRange])

  const handleDateSelect = React.useCallback(
    (newValue?: DateRange) => {
      void setDateParams({
        from: newValue?.from ? startOfDay(newValue.from).toISOString() : "",
        to: newValue?.to ? endOfDay(newValue.to).toISOString() : ""
      })
    },
    [setDateParams]
  )

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={cn(
              "w-full justify-start gap-2 truncate text-left font-normal",
              !date.to && !date.from && "text-muted-foreground",
              triggerClassName
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>{placeholder}</span>
            )}

            {(date?.from || date?.to) && (
              <span
                role="button"
                className="ml-auto hidden text-muted-foreground transition-colors hover:text-foreground sm:block"
                onClick={(evt) => {
                  evt.stopPropagation()
                  evt.preventDefault()
                  handleDateSelect()
                }}
              >
                <X className="!size-3.5" />
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-auto p-0", className)} {...props}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
