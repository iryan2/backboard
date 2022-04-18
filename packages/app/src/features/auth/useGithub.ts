import axios from 'axios'
import { useToken } from 'sections/login/useToken'

export function useGithub() {
  const token = useToken()
  const instance = axios.create({
    baseURL:
      'https://api.github.com/repos/iryan2/backboard-page/contents/links/',
    headers: { Authorization: `Bearer ${token}` },
  })

  return instance
}
