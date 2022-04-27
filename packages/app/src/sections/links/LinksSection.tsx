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

export function Links() {
  const dispatch = useDispatch()
  const head = useSelector(getHead)
  const links = useSelector(getLinks)

  useEffect(() => {
    // only fetch links once
    if (!head) {
      dispatch(fetchLinks())
    }
  }, [dispatch, head])

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
                Delete
              </Button>
            </Stack>
          </LinkCard>
        ))}
      </Stack>
    </section>
  )
}
async function handleDelete(id: string, headId: string, title: string) {
  const github = getGithubInstance()

  if (id === headId) {
    // retrieve head
    const { data: headData } = await github.get(`${headId}.json`)
    const headContent = decodeContent(headData.content)

    // retrieve previous
    const { data: prevData } = await github.get(`${headContent.prev}.json`)
    const prevContent = decodeContent(prevData.content)

    // // retrieve head pointer
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
  } else {
    // change id.prev.next to id.next
    // change id.next.prev to id.prev
    //  delete id
    console.log('id does not match head', id, headId)
  }
}
