import { Label } from './Label'

type Props = {
  value: string
  name: string
  onChange: (value: string) => void
}

export function TextInput({ value, name, onChange }: Props) {
  return (
    <>
      <Label htmlFor={name}>{name}</Label>
      <input
        type="text"
        name={name}
        value={value}
        style={{ border: 'var(--border)' }}
        onChange={({ target: { value } }) => onChange(value)}
      />
    </>
  )
}
