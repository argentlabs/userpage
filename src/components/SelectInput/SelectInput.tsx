import { ChangeEventHandler, FC } from "react"

import { SExpand, Select, SelectInputWrapper } from "./SelectInput.style"

interface SelectInputProps {
  value?: string
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
    <SelectInputWrapper>
      <Select {...props}>
        {options.map(({ value, display, disabled }) => (
          <option disabled={disabled} key={value} value={value}>
            {display}
          </option>
        ))}
      </Select>
      <SExpand />
    </SelectInputWrapper>
  )
}
