import { Text } from '../Text'

type Props = {
  children: React.ReactNode
  htmlFor: string
}
export function Label({ children, htmlFor }: Props) {
  return (
    <label htmlFor={htmlFor}>
      <Text>{children}</Text>
    </label>
  )
}
