import { getGithubInstance } from 'features/auth/getGithubInstance'
import type { Head, NewLink } from './postNewLink'

export async function linkPreviousToNew(newLink: NewLink, head: Head) {
  const github = getGithubInstance()
  // update previous head, so ~`previousHead.next` points to the link we just created
  const { data: prevData } = await github.get(`${head.id}.json`)
  console.log('prevResponse', prevData)
  const prev = {
    id: prevData.id,
    content: JSON.parse(atob(prevData.content)),
    sha: prevData.sha,
  }
  console.log('prev', prev)

  prev.content.next = newLink.id
  const updatedPrevResponse = await github.put(`${head.id}.json`, {
    message: `Update prev for link: ${newLink.title}\n\n${newLink.href}`,
    content: btoa(JSON.stringify(prev.content)),
    sha: prev.sha,
  })
  console.log('updatedPrevResponse', updatedPrevResponse)
}
