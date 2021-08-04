import { ChangeEventHandler, FC } from "react"

import { Select } from "./SelectInput.style"

interface SelectInputProps {
  onChange?: ChangeEventHandler<HTMLSelectElement>
  disabled?: boolean
  options: Array<{
    value: string
    display: string
    disabled?: boolean
  }>
}

export const SelectInput: FC<SelectInputProps> = ({
  options = [],
  ...props
}) => {
  return (
    <Select {...props}>
      {options.map(({ value, display, disabled }) => (
        <option disabled={disabled} key={value} value={value}>
          {display}
        </option>
      ))}
    </Select>
  )
}
