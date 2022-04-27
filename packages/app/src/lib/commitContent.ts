export function encodeContent(content: object) {
  return btoa(JSON.stringify(content))
}

export function decodeContent(content: string) {
  return JSON.parse(atob(content))
}
