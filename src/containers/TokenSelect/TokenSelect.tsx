import { ethers } from "ethers"
import { useAtom } from "jotai"
import { FC, Suspense } from "react"

import SelectInput from "../../components/SelectInput"
import { tokensAtom } from "./state"

const TokenSelectLoaded: FC = () => {
  const [tokens] = useAtom(tokensAtom)
  return (
    <SelectInput
      options={tokens.map(({ address, symbol, balance, decimals }) => ({
        display: `${symbol} (${ethers.utils.formatUnits(balance, decimals)})`,
        value: address,
        disabled: balance.eq(0) && address !== ethers.constants.AddressZero,
      }))}
    />
  )
}

export const TokenSelect: FC = () => {
  return (
    <Suspense
      fallback={
        <SelectInput
          options={[
            {
              display: "ETH",
              value: "",
            },
          ]}
          disabled
        />
      }
    >
      <TokenSelectLoaded />
    </Suspense>
  )
}
