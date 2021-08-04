import { FC } from "react"

import { Select } from "./SelectInput.style"

interface SelectInputProps {}

export const SelectInput: FC<SelectInputProps> = () => {
  return (
    <Select>
      <option>Test</option>
      <option>Test</option>
      <option>Test</option>
      <option>Test</option>
      <option>Test</option>
      <option>Test</option>
      <option>Test</option>
    </Select>
  )
}
