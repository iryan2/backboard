import { Label } from './Label'

type Props = {
  value: string
  name: string
  onChange: (value: string) => void
}

export function TextArea({ value, name, onChange }: Props) {
  return (
    <>
      <Label htmlFor={name}>{name}</Label>
      <textarea
        name={name}
        value={value}
        style={{ border: 'var(--border)' }}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </>
  )
}
