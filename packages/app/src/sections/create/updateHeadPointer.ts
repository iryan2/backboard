import { getGithubInstance } from 'features/auth/getGithubInstance'
import { replaceHeadPointer } from 'lib/replaceHeadPointer'
import { headPointerFilename, NewLink } from './postNewLink'

export async function updateHead(newLink: NewLink) {
  const github = getGithubInstance()

  // update head pointer
  const { data: headData } = await github.get(headPointerFilename)
  const headPointer = {
    content: JSON.parse(atob(headData.content)),
    sha: headData.sha,
  }
  console.log('head content', headPointer.content)

  const updatedHeadResponse = await github.put(headPointerFilename, {
    message: `Update head for link: ${newLink.title}\n\n${newLink.href}`,
    content: replaceHeadPointer(newLink.id),
    sha: headPointer.sha,
  })
  console.log('updatedHeadResponse', updatedHeadResponse)
}
