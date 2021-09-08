import chunk from "lodash.chunk"
import { FC, useCallback, useRef, useState } from "react"
import CopyToClipboard from "react-copy-to-clipboard"

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
}

const useQueue = <T extends any>(
  timeout: number,
): [{ id: number; arg: T }[], (arg: T) => void] => {
  const [queue, setQueue] = useState<{ id: number; arg: T }[]>([])
  const pids = useRef<number[]>([])

  const addToQueue = useCallback(
    (arg) => {
      const id = Math.round(Math.random() * 100000)
      setQueue((x) => [...x, { id, arg }])

      const pid = setTimeout(() => {
        pids.current = pids.current.filter((x) => x !== pid)
        setQueue((x) => x.filter((y) => y.id !== id))
      }, timeout) as unknown as number

      pids.current.push(pid)
    },
    [setQueue, timeout],
  )

  return [queue, addToQueue]
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
  children,
  ...props
}) => {
  const [clickFeedbackQueue, addToFeedbackQueue] =
    useQueue<{ x: number; y: number }>(1200)

  return (
    <CopyToClipboard text={copyValue || `${zkSync ? "zksync:" : ""}${address}`}>
      <AddressBase
        onClick={(e) => {
          addToFeedbackQueue({
            x: e.clientX - e.currentTarget.getBoundingClientRect().x,
            y: e.clientY - e.currentTarget.getBoundingClientRect().y,
          })
        }}
        {...props}
      >
        {formatAddress(address, {
          short,
          zkSync,
        })}
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
