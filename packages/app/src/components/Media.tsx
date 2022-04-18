import { Imgur } from '../features/embed/Imgur'
import { Twitter } from '../features/embed/Twitter'
import { getFileExtension } from '../lib/getFileExtension'
import { Frame } from './Frame'

type Props = {
  href: string
}

export function Media({ href }: Props) {
  const extension = getFileExtension(href)

  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return (
        <Frame>
          <a href={href}>
            <img
              src={href}
              alt="interesting content"
              style={{
                maxHeight: '100%',
                maxWidth: '100%',
                objectFit: 'contain',
              }}
            />
          </a>
        </Frame>
      )
  }

  if (href.includes('twitter.com')) {
    return <Twitter href={href} />
  }

  if (href.includes('imgur.com')) {
    return <Imgur href={href} />
  }

  return null
}
