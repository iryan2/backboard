import axios from 'axios'
import { getToken } from 'sections/login/getToken'

export function getGithubInstance() {
  const token = getToken()
  const instance = axios.create({
    baseURL:
      'https://api.github.com/repos/iryan2/backboard-page/contents/links/',
    headers: { Authorization: `Bearer ${token}` },
  })

  return instance
}
