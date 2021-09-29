import { ethers } from "ethers"
import chunk from "lodash.chunk"
import { FC, useMemo } from "react"
import CopyToClipboard from "react-copy-to-clipboard"

import { useQueue } from "../../hooks/useQueue"
import { AddressBase, ConfirmationIndicator } from "./Address.style"

interface FormatAddressOptions {
  short?: boolean
  zkSync?: boolean
}

export const formatAddress = (
  address: string,
  { short = false, zkSync = false }: FormatAddressOptions = {},
) =>
  `${zkSync ? "zksync: " : ""}0x ${chunk(address.substr(2).split(""), 4)
    .filter((_, i, a) => !short || i === 0 || i === a.length - 1)
    .map((x) => x.join(""))
    .join(short ? " … " : " ")}`

export interface AddressProps extends FormatAddressOptions {
  address: string
  copyValue?: string
  confirmationText?: string
}

const getConfirmationEmoji = (
  seed: number = Math.random() * 100000,
  total: number = 100000,
) => {
  const randomValue = Math.ceil((seed / total) * 4)

  switch (randomValue) {
    case 1:
      return "👌"
    case 2:
      return "✅"
    case 3:
      return "🎉"
    default:
      return "👍"
  }
}

export const Address: FC<AddressProps> = ({
  zkSync,
  short,
  address,
  copyValue,
  confirmationText,
  children,
  ...props
}) => {
  const [clickFeedbackQueue, addToFeedbackQueue] =
    useQueue<{ x: number; y: number }>(1200)

  const checksumAddress = useMemo(
    () => ethers.utils.getAddress(address),
    [address],
  )

  return (
    <CopyToClipboard
      text={copyValue || `${zkSync ? "zksync:" : ""}${checksumAddress}`}
    >
      <AddressBase
        onClick={(e) => {
          addToFeedbackQueue({
            x: e.clientX - e.currentTarget.getBoundingClientRect().x,
            y: e.clientY - e.currentTarget.getBoundingClientRect().y,
          })
        }}
        {...props}
      >
        <p>
          {confirmationText && clickFeedbackQueue.length
            ? confirmationText
            : formatAddress(checksumAddress, {
                short,
                zkSync,
              })}
        </p>
        {children}
        {clickFeedbackQueue.map(({ id, arg }) => (
          <ConfirmationIndicator key={id} {...arg}>
            {getConfirmationEmoji(id)}
          </ConfirmationIndicator>
        ))}
      </AddressBase>
    </CopyToClipboard>
  )
}
