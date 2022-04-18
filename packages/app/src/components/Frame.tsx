type Props = {
  children: React.ReactNode
}

export function Frame({ children }: Props) {
  return (
    <div
      style={{
        height: '400px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'var(--black)',
      }}
    >
      {children}
    </div>
  )
}
