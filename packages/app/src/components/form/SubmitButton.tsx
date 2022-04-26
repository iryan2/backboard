import { SubmissionState } from 'sections/create/AddLinkForm'

type Props = {
  label?: string
  onClick: () => void
  state: SubmissionState
}

export function SubmitButton({ label = 'submit', onClick, state }: Props) {
  return (
    <input
      type="submit"
      disabled={state === 'attempt'}
      onClick={(e) => {
        e.preventDefault()
        onClick()
      }}
      value={getLabel(state)}
      style={{
        appearance: 'none',
        border: 'var(--border)',
        color: 'var(--text-color)',
        backgroundColor: 'var(--white)',
      }}
    />
  )
}

function getLabel(state: SubmissionState) {
  switch (state) {
    case 'initial':
      return 'Submit'
    case 'attempt':
      return 'Shoots...'
    case 'success':
      return 'Score!'
    case 'fail':
      return 'Failed'
  }
}
