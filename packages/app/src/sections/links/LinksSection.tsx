import { useDispatch, useSelector } from 'react-redux'
import { fetchLinks, Link } from 'sections/links/linksSlice'
import { getHead, getLinks } from 'features/selectors'
import { useEffect } from 'react'
import { Stack } from 'components/layout/Stack'
import { LinkCard } from 'components/LinkCard'

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
            <a
              href={link.href}
              style={{ textDecoration: 'none', color: 'var(--text-color)' }}
            >
              {link.title}
            </a>
            <br />
            <pre style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {link.href}
            </pre>
          </LinkCard>
        ))}
      </Stack>
    </section>
  )
}
