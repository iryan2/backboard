import { getGithubInstance } from 'features/auth/getGithubInstance'
import type { Head, NewLink } from './postNewLink'

export async function updateHead(newLink: NewLink, head: Head) {
  const github = getGithubInstance()

  const updatedHeadResponse = await github.put('head.json', {
    message: `Update head for link: ${newLink.title}\n\n${newLink.href}`,
    content: btoa(JSON.stringify(head.content)),
    sha: head.sha,
  })
  console.log('updatedHeadResponse', updatedHeadResponse)
}
