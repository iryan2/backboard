import { getGithubInstance } from 'features/auth/getGithubInstance'
import { linkPreviousToNew } from './linkPreviousToNew'
import { updateHead } from './updateHeadPointer'

export const headPointerFilename = 'head.json'
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

export async function postNewLink(title: string, url: string) {
  const github = getGithubInstance()

  const currentHead = await github.get(headPointerFilename)
  const head = {
    id: JSON.parse(atob(currentHead.data.content)).head,
    content: JSON.parse(atob(currentHead.data.content)),
    sha: currentHead.data.sha,
  }
  console.log('head before writing new link', head)

  const newLink = {
    id: crypto.randomUUID(),
    title,
    href: url,
    time: new Date().toISOString(),
    next: null,
    prev: head.id,
  }

  const newLinkPostResponse = await github.put(`${newLink.id}.json`, {
    message: `Create new link: ${newLink.title}\n\n${newLink.href}`,
    content: btoa(JSON.stringify(newLink)),
  })
  console.log('post new link response', newLinkPostResponse)

  await linkPreviousToNew(newLink, head)
  await updateHead(newLink)
  return newLink
}
