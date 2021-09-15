import { ethers } from "ethers"
import { FC } from "react"

import SelectInput from "../../components/SelectInput"
import { useSendContextSelector } from "../../states/hooks"
import { Token } from "../../states/send"

interface TokenSelectProps {
  value: string
  onChange: (token: Token) => any
}

export const TokenSelect: FC<TokenSelectProps> = ({
  value,
  onChange,
  ...props
}) => {
  const { tokens } = useSendContextSelector()

  if (!tokens.length)
    return (
      <SelectInput
        options={[
          {
            display: "ETH",
            value: ethers.constants.AddressZero,
          },
        ]}
        disabled
      />
    )

  return (
    <SelectInput
      value={value}
      options={tokens.map(({ address, symbol, balance, decimals }) => ({
        display: `${symbol} (${ethers.utils.formatUnits(balance, decimals)})`,
        value: address,
        disabled: balance.eq(0) && address !== ethers.constants.AddressZero,
      }))}
      onChange={(e) => {
        onChange?.(tokens.find((x) => x.address === e.target.value)!)
      }}
      {...props}
    />
  )
}
