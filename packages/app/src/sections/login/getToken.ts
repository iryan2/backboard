const localStorageKey = 'auth_token'

export function getToken() {
  // see if we've already got a token
  const storedToken = localStorage.getItem(localStorageKey)
  if (storedToken) {
    return storedToken
  }

  // otherwise, see if it's part of the current url
  const searchParams = new URLSearchParams(window.location.search)
  const token = searchParams.get('token')
  if (token !== null) {
    localStorage.setItem(localStorageKey, token)
    window.history.pushState({}, document.title, window.location.pathname)
  }
}
