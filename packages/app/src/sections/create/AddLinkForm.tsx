import { useState } from 'react'
import { useGithub } from 'features/auth/useGithub'
import { LoginButton } from 'sections/login/LoginButton'
import { Stack } from 'components/layout/Stack'
import { Spacer } from 'components/layout/Spacer'
import { TextInput } from 'components/form/TextInput'
import { TextArea } from 'components/form/TextArea'
import { SubmitButton } from 'components/form/SubmitButton'
import { postNewLink } from './postNewLink'
import { linkPreviousToNew } from './linkPreviousToNew'
import { updateHead } from './updateHead'

const headFilename = 'head.json'

type Props = {
  loggedIn: boolean
}

export type SubmissionState = 'initial' | 'attempt' | 'success' | 'fail'
export type Head = {
  id: string
  content: string
  sha: string
}
export type NewLink = {
  id: string
  title: string
  href: string
  time: string
  next: null
  prev: string
}

export function AddLinkForm({ loggedIn }: Props) {
  const [title, setTitle] = useState('')
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('initial')
  const [url, setUrl] = useState('')
  const github = useGithub()

  async function handleSubmit() {
    setSubmissionState('attempt')
    const currentHead = await github.get(headFilename)

    const head = {
      id: JSON.parse(atob(currentHead.data.content)).head,
      content: JSON.parse(atob(currentHead.data.content)),
      sha: currentHead.data.sha,
    }
    console.log('head before writing new link', head)

    // post new one,
    // grab next value from current head
    // generate guid
    // assemble data
    const newLink = {
      id: crypto.randomUUID(),
      title,
      href: url,
      time: new Date().toISOString(),
      next: null,
      prev: head.id,
    }
    try {
      await postNewLink(newLink)
      await linkPreviousToNew(newLink, head)
      await updateHead(newLink, head)

      setSubmissionState('success')
      setTitle('')
      setUrl('')
      setTimeout(() => setSubmissionState('initial'), 1000)
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
