import * as React from "react"
import { NumericFormat } from "react-number-format"

import { Input } from "@/components/ui/input"

import type { NumericFormatProps } from "react-number-format"

const NumberInput = React.forwardRef<
  HTMLInputElement,
  NumericFormatProps & { nullable?: boolean }
>(
  (
    {
      onChange,
      valueIsNumericString = true,
      allowNegative = false,
      min = 0,
      decimalScale = 3,
      nullable = false,
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
            onChange({
              target: {
                value: isNaN(Number(floatValue))
                  ? nullable
                    ? null
                    : undefined
                  : Number(floatValue)
              }
            } as unknown as React.ChangeEvent<HTMLInputElement>)
          }
        }}
        {...props}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
