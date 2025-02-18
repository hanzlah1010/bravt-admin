import { useInView, useMotionValue, useSpring } from "motion/react"
import { useEffect, useRef } from "react"

import { cn, formatPrice } from "@/lib/utils"

import type { ComponentPropsWithoutRef } from "react"

interface NumberTickerProps extends ComponentPropsWithoutRef<"span"> {
  value: number
  direction?: "up" | "down"
  delay?: number // delay in s
  formatStyle?: keyof Intl.NumberFormatOptionsStyleRegistry
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  formatStyle = "currency",
  ...props
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const motionValue = useMotionValue(direction === "down" ? value : 0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  })
  const isInView = useInView(ref, { once: true, margin: "0px" })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value)
      }, delay * 1000)
    }
  }, [motionValue, isInView, delay, value, direction])

  useEffect(
    () =>
      springValue.on("change", (latest) => {
        if (ref.current) {
          ref.current.textContent = formatPrice(latest, 0, formatStyle)
        }
      }),
    [springValue, formatStyle]
  )

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatPrice(0, 0, formatStyle)
    }
  }, [value, formatStyle])

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-wider", className)}
      {...props}
    />
  )
}
