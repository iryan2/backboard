import { getGithubInstance } from 'features/auth/getGithubInstance'
import type { NewLink } from './AddLinkForm'

export async function postNewLink(newLink: NewLink) {
  const github = getGithubInstance()
  const newLinkPostResponse = await github.put(`${newLink.id}.json`, {
    message: `Create new link: ${newLink.title}\n\n${newLink.href}`,
    content: btoa(JSON.stringify(newLink)),
  })
  console.log('post new link response', newLinkPostResponse)
}
