import { Frame } from 'components/Frame'
import { TwitterTweetEmbed, TwitterTimelineEmbed } from 'react-twitter-embed'

type Props = {
  href: string
}

export function Twitter({ href }: Props) {
  const indexOfLastSlash = href.lastIndexOf('/')
  const targetAndQueryParams = href.slice(indexOfLastSlash + 1, href.length)
  const target = targetAndQueryParams.split('?')[0].split('#')[0]

  if (parseInt(target)) {
    // here we know target is an id, so we assume it's a tweet
    return (
      <Frame>
        <TwitterTweetEmbed tweetId={target} />
      </Frame>
    )
  }

  // otherwise we assume it's a profile link
  return (
    <Frame>
      <TwitterTimelineEmbed
        sourceType="url"
        url={href}
        options={{ height: 400 }}
        noHeader
        noFooter
      />
    </Frame>
  )
}
