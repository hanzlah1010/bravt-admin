import * as React from "react"
import { NumericFormat } from "react-number-format"

import { Input } from "@/components/ui/input"

import type { NumericFormatProps } from "react-number-format"

const NumberInput = React.forwardRef<HTMLInputElement, NumericFormatProps>(
  (
    {
      onChange,
      valueIsNumericString = true,
      allowNegative = false,
      min = 0,
      decimalScale = 3,
      ...props
    },
    ref
  ) => {
    return (
      <NumericFormat
        getInputRef={ref}
        customInput={Input}
        allowNegative={allowNegative}
        min={min}
        decimalScale={decimalScale}
        valueIsNumericString={valueIsNumericString}
        autoComplete="off"
        onValueChange={({ floatValue }) => {
          if (onChange) {
            const event = { target: { value: Number(floatValue) } }
            onChange(event as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }}
        {...props}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
