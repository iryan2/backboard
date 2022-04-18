import { Label } from './Label'

type Props = {
  value: string
  name: string
  onChange: (value: string) => void
  disabled: boolean
}

export function TextInput({ value, name, onChange, disabled }: Props) {
  return (
    <>
      <Label htmlFor={name}>{name}</Label>
      <input
        type="text"
        name={name}
        value={value}
        style={{ border: 'var(--border)' }}
        onChange={({ target: { value } }) => onChange(value)}
        disabled={disabled}
      />
    </>
  )
}
