import { useState } from 'react'
import { LoginButton } from 'sections/login/LoginButton'
import { Stack } from 'components/layout/Stack'
import { Spacer } from 'components/layout/Spacer'
import { TextInput } from 'components/form/TextInput'
import { TextArea } from 'components/form/TextArea'
import { SubmitButton } from 'components/form/SubmitButton'
import { postNewLink } from './postNewLink'
import { useDispatch } from 'react-redux'
import linksSlice from 'sections/links/linksSlice'

type Props = {
  loggedIn: boolean
}

export type SubmissionState = 'initial' | 'attempt' | 'success' | 'fail'
export function AddLinkForm({ loggedIn }: Props) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('initial')
  const [url, setUrl] = useState('')

  async function handleSubmit() {
    setSubmissionState('attempt')

    try {
      const newLink = await postNewLink(title, url)

      setSubmissionState('success')
      dispatch(linksSlice.actions.linkPosted(newLink))
      setTitle('')
      setUrl('')
      setTimeout(() => setSubmissionState('initial'), 1500)
    } catch {
      setSubmissionState('fail')
    }
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {loggedIn ? (
        <form>
          <Stack gap={4}>
            <TextInput
              name="title"
              value={title}
              onChange={(value) => setTitle(value)}
              disabled={submissionState === 'attempt'}
            />
            <Spacer height={4} />
            <TextArea
              name="content"
              value={url}
              onChange={(value) => setUrl(value)}
              disabled={submissionState === 'attempt'}
            />
            <Spacer height={8} />
            <SubmitButton state={submissionState} onClick={handleSubmit} />
          </Stack>
        </form>
      ) : (
        <LoginButton />
      )}
    </div>
  )
}
