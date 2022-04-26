import { getGithubInstance } from 'features/auth/getGithubInstance'
import type { Head, NewLink } from './postNewLink'

export async function updateHead(newLink: NewLink) {
  const github = getGithubInstance()

  // update head pointer
  const { data: headData } = await github.get('head.json')
  const head = {
    content: JSON.parse(atob(headData.content)),
    sha: headData.sha,
  }
  head.content.head = newLink.id
  console.log('head content', head.content)

  const updatedHeadResponse = await github.put('head.json', {
    message: `Update head for link: ${newLink.title}\n\n${newLink.href}`,
    content: btoa(JSON.stringify(head.content)),
    sha: head.sha,
  })
  console.log('updatedHeadResponse', updatedHeadResponse)
}
