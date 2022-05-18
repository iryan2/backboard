import { useDispatch, useSelector } from 'react-redux'
import { fetchLinks, Link } from 'sections/links/linksSlice'
import { getHead, getLinks } from 'features/selectors'
import { useEffect } from 'react'
import { Stack } from 'components/layout/Stack'
import { LinkCard } from 'components/LinkCard'
import { Button } from 'components/Button'
import { getGithubInstance } from 'features/auth/getGithubInstance'
import { headPointerFilename } from 'sections/create/postNewLink'
import { replaceHeadPointer } from 'lib/replaceHeadPointer'
import { decodeContent, encodeContent } from 'lib/commitContent'
import { SubmissionState } from 'sections/create/AddLinkForm'
import React from 'react'

export function Links() {
  const dispatch = useDispatch()
  const head = useSelector(getHead)
  const links = useSelector(getLinks)
  const [deleteButtonLabel, setDeleteButtonLabel] = React.useState('Delete')

  useEffect(() => {
    // only fetch links once
    if (!head) {
      dispatch(fetchLinks())
    }
  }, [dispatch, head])

  async function handleDelete(
    idOfLinkToBeDeleted: string,
    headId: string,
    title: string
  ) {
    const github = getGithubInstance()
    setDeleteButtonLabel('Going')

    if (idOfLinkToBeDeleted !== headId) {
      // not the most recent link
      // fetch id
      const { data: linkToBeDeletedData } = await github.get(
        `${idOfLinkToBeDeleted}.json`
      )
      const linkToBeDeleted = decodeContent(linkToBeDeletedData.content)

      // fetch linkToBeDeleted.next
      const { data: nextData } = await github.get(
        `${linkToBeDeleted.next}.json`
      )
      const nextContent = decodeContent(nextData.content)
      setDeleteButtonLabel(' ')

      // fetch linkToBeDeleted.prev
      const { data: prevData } = await github.get(
        `${linkToBeDeleted.prev}.json`
      )
      const prevContent = decodeContent(prevData.content)

      // change linkToBeDeleted.next.prev to linkToBeDeleted.prev
      nextContent.prev = linkToBeDeleted.prev
      const updatedNextResponse = await github.put(`${nextContent.id}.json`, {
        message: `deleting link ${title}: Update next`,
        content: encodeContent(nextContent),
        sha: nextData.sha,
      })
      setDeleteButtonLabel('Going')

      // change linkToBeDeleted.prev.next to linkToBeDeleted.next
      prevContent.next = linkToBeDeleted.next
      const updatedPrevResponse = await github.put(`${prevContent.id}.json`, {
        message: `deleting link ${title}: Update prev`,
        content: encodeContent(prevContent),
        sha: prevData.sha,
      })
      setDeleteButtonLabel('Gone')

      // delete linkToBeDeleted
      const deletingResponse = await github.put(`${idOfLinkToBeDeleted}.json`, {
        message: `writing null - deleting link ${title}`,
        content: encodeContent({}),
        sha: linkToBeDeletedData.sha,
      })
      setDeleteButtonLabel('Gone')
      return
    } else {
      // the most recent link

      // TODO: label states: going going gone

      // fetch head
      const { data: headData } = await github.get(`${headId}.json`)
      const headContent = decodeContent(headData.content)

      // fetch previous
      const { data: prevData } = await github.get(`${headContent.prev}.json`)
      const prevContent = decodeContent(prevData.content)

      // fetch head pointer
      const { data: headPointerData } = await github.get(headPointerFilename)

      const updatedHeadResponse = await github.put(headPointerFilename, {
        message: `Updating head pointer - deleting link ${title}`,
        // change head to head.prev
        content: replaceHeadPointer(headContent.prev),
        sha: headPointerData.sha,
      })

      // change new prev.next to null
      prevContent.next = null
      const updatedPrevResponse = await github.put(`${prevContent.id}.json`, {
        message: `Update prev - deleting link ${title}`,
        content: encodeContent(prevContent),
        sha: prevData.sha,
      })

      // delete the old head (which is id)
      const deletingResponse = await github.put(`${headId}.json`, {
        message: `writing null - deleting link ${title}`,
        content: encodeContent({}),
        sha: headData.sha,
      })

      console.log(`deletingResponse`, deletingResponse)
    }
  }

  return (
    <section style={{ width: '100%', maxWidth: '450px' }}>
      <Stack gap={8}>
        {links.map((link: Link) => (
          <LinkCard key={link.id} href={link.href}>
            <Stack gap={2}>
              <a
                href={link.href}
                style={{ textDecoration: 'none', color: 'var(--text-color)' }}
              >
                {link.title}
              </a>
              <pre style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {link.href}
              </pre>
              <Button onClick={() => handleDelete(link.id, head, link.title)}>
                {deleteButtonLabel}
              </Button>
            </Stack>
          </LinkCard>
        ))}
      </Stack>
    </section>
  )
}

function getLabel(state: SubmissionState) {
  switch (state) {
    case 'initial':
      return 'Delete'
    case 'attempt':
      return 'Going..'
    case 'success':
      return 'Gone!'
    case 'fail':
      return 'Try again?'
  }
}
