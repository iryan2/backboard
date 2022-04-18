import { Card } from './Card'
import { Media } from './Media'

type Props = {
  href: string
  children: React.ReactNode
}
export function LinkCard({ children, href }: Props) {
  return (
    <div style={{ color: 'var(--text-color)' }}>
      <Card>
        {children}
        <Media href={href} />
      </Card>
    </div>
  )
}
