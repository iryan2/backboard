import { Frame } from 'components/Frame'

type Props = {
  href: string
}

export function Imgur({ href }: Props) {
  // href might have extension or not: https://i.imgur.com/A61SaA1.gifv or https://i.imgur.com/A61SaA1
  // if not, do embed.
  // If so, determine whether it's an image or video

  let file = href.split('https://i.imgur.com/')[1]
  if (!file) {
    file = href.split('https://imgur.com/')[1]
  }

  const [name, extension] = file.split('.')

  switch (extension) {
    case 'gifv':
      return (
        <Frame>
          <video style={{ height: '100%' }} controls>
            <source src={`https://i.imgur.com/${name}.mp4`} type="video/mp4" />
            <source
              src={`https://i.imgur.com/${name}.webm`}
              type="video/webm"
            />
          </video>
        </Frame>
      )
    default:
      // this setTimeout hack causes createIframe to be called after the blockquote mounts
      // @ts-ignore
      setTimeout(window.imgurEmbed?.createIframe(), 1000)
      return (
        <Frame>
          <blockquote
            className="imgur-embed-pub"
            lang="en"
            data-id={name}
          ></blockquote>
        </Frame>
      )
  }
}
