import { ethers } from "ethers"
import { useAtom } from "jotai"
import { FC, Suspense, useEffect } from "react"

import SelectInput from "../../components/SelectInput"
import { Token, tokensAtom } from "./state"

interface TokenSelectProps {
  onResponse?: (tokens: Token[]) => any
  onChange?: (token: Token) => any
}

const TokenSelectLoaded: FC<TokenSelectProps> = ({ onResponse, onChange }) => {
  const [tokens] = useAtom(tokensAtom)
  useEffect(() => {
    onResponse?.(tokens)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokens])
  return (
    <SelectInput
      options={tokens.map(({ address, symbol, balance, decimals }) => ({
        display: `${symbol} (${ethers.utils.formatUnits(balance, decimals)})`,
        value: address,
        disabled: balance.eq(0) && address !== ethers.constants.AddressZero,
      }))}
      onChange={(e) => {
        onChange?.(tokens.find((x) => x.address === e.target.value)!)
      }}
    />
  )
}

export const TokenSelect: FC<TokenSelectProps> = ({ ...props }) => {
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
      <TokenSelectLoaded {...props} />
    </Suspense>
  )
}
