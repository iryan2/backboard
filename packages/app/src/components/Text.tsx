type Props = {
  children: React.ReactNode
}
export function Text({ children }: Props) {
  return <span style={{ color: 'var(--text-color)' }}>{children}</span>
}
