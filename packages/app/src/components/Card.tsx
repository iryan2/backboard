type Props = {
  children: React.ReactNode
}
export function Card({ children }: Props) {
  return (
    <div
      style={{
        borderRadius: '4px',
        border: '1px solid var(--light-grey)',
        padding: '16px',
      }}
    >
      {children}
    </div>
  )
}
