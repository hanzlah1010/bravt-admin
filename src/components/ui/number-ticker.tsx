import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "motion/react"

import { cn, formatPrice } from "@/lib/utils"

interface NumberTickerProps {
  value: number
  formatStyle?: keyof Intl.NumberFormatOptionsStyleRegistry
  className?: string
}

export function NumberTicker({
  value: _value,
  className,
  formatStyle = "currency"
}: NumberTickerProps) {
  const [value, setValue] = useState(0)

  const spring = useSpring(value, { bounce: 0, duration: 1000 })
  const display = useTransform(spring, (current) =>
    formatPrice(current, 0, formatStyle)
  )

  useEffect(() => {
    setValue(_value)
  }, [_value])

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {display}
    </motion.span>
  )
}
