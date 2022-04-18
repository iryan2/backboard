import { whitespace } from './whitespace'

type Props = {
  height: whitespace
}

export function Spacer({ height }: Props) {
  return <div style={{ height: `${height}px` }} />
}
