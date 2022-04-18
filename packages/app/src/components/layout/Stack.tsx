import { whitespace } from './whitespace'

type Props = {
  children: React.ReactNode
  gap: whitespace
}

export function Stack({ children, gap }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        rowGap: `${gap}px`,
      }}
    >
      {children}
    </div>
  )
}
