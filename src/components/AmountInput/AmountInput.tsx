import { FC, useMemo } from "react"

import { AmountInputBare } from "./AmountInput.style"

interface AmountInputProps {
  value: string
  placeholder: string
  onChange: (amount: string) => any
}

export const AmountInput: FC<AmountInputProps> = ({
  value,
  placeholder,
  onChange,
  ...props
}) => {
  const length = useMemo(() => value.length, [value])

  return (
    <AmountInputBare
      length={length}
      value={value}
      placeholder={placeholder}
      onChange={(e) => {
        let value = e.target.value.replace(",", ".")
        if (value === ".") value = "0."
        if (value === "0") value = ""
        if (value === "" || /^[0-9\b]+\.?[0-9\b]*$/.test(value)) {
          onChange(value)
        }
      }}
      autoFocus
      autoComplete="off"
      pattern="[0-9]+"
      inputMode="decimal"
      {...props}
    />
  )
}
