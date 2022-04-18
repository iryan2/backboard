import { useState } from 'react'
import { useGithub } from 'features/auth/useGithub'
import { LoginButton } from 'sections/login/LoginButton'
import { Stack } from 'components/layout/Stack'
import { Spacer } from 'components/layout/Spacer'
import { TextInput } from 'components/form/TextInput'
import { TextArea } from 'components/form/TextArea'
import { SubmitButton } from 'components/form/SubmitButton'

const headFilename = 'head.json'

type Props = {
  loggedIn: boolean
}

export type SubmissionState = 'initial' | 'attempt' | 'success' | 'fail'

export function AddLinkForm({ loggedIn }: Props) {
  const [title, setTitle] = useState('')
  const [submissionState, setSubmissionState] =
    useState<SubmissionState>('initial')
  const [url, setUrl] = useState('')
  const github = useGithub()

  async function handleSubmit() {
    const currentHeadResponse = await github.get(headFilename)
    setSubmissionState('attempt')
    const { sha: currentHeadSha, content: currentHeadContent } =
      currentHeadResponse.data

    const originalHead = {
      sha: currentHeadSha,
      id: JSON.parse(atob(currentHeadContent)).head,
    }
    console.log('head before writing new link', originalHead)
    // post new one,
    // grab next value from current head
    // generate guid
    // assemble data
    const newLink = {
      // TODO: remove ts-ignore when TS knows about the new API
      // @ts-ignore: Bleeding edge UUID API, TS doesn't know about it yet
      id: crypto.randomUUID(),
      title,
      href: url,
      time: new Date().toISOString(),
      next: null,
      prev: originalHead.id,
    }
    console.log('newLink', newLink)
    const newLinkPostResponse = await github.put(`${newLink.id}.json`, {
      message: `Create new link: ${newLink.title}\n\n${newLink.href}`,
      content: btoa(JSON.stringify(newLink)),
    })
    console.log('response', newLinkPostResponse)

    // update previous head, so ~`previousHead.next` points to the link we just created
    const { data: prevData } = await github.get(`${originalHead.id}.json`)
    console.log('prevResponse', prevData)
    const prev = {
      id: prevData.id,
      content: JSON.parse(atob(prevData.content)),
      sha: prevData.sha,
    }
    console.log('prev', prev)
    prev.content.next = newLink.id
    const updatedPrevResponse = await github.put(`${originalHead.id}.json`, {
      message: `Update prev for link: ${newLink.title}\n\n${newLink.href}`,
      content: btoa(JSON.stringify(prev.content)),
      sha: prev.sha,
    })
    console.log('updatedPrevResponse', updatedPrevResponse)

    // update head pointer
    const { data: headData } = await github.get('head.json')
    const head = {
      content: JSON.parse(atob(headData.content)),
      sha: headData.sha,
    }
    head.content.head = newLink.id
    console.log('head content', head.content)
    try {
      const updatedHeadResponse = await github.put('head.json', {
        message: `Update head for link: ${newLink.title}\n\n${newLink.href}`,
        content: btoa(JSON.stringify(head.content)),
        sha: head.sha,
      })
      console.log('updatedHeadResponse', updatedHeadResponse)

      setSubmissionState('success')
      setTitle('')
      setUrl('')
      setTimeout(() => setSubmissionState('initial'))
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
