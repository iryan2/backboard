import { encodeContent } from './commitContent'

export function replaceHeadPointer(id: string) {
  return encodeContent({ head: id })
}
