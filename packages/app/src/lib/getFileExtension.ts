export function getFileExtension(url: string) {
  // Extension starts after the first dot after the last slash
  var extStart = url.indexOf('.', url.lastIndexOf('/') + 1)
  if (extStart === -1) return false
  var ext = url.substr(extStart + 1),
    // end of extension must be one of: end-of-string or question-mark or hash-mark
    extEnd = ext.search(/$|[?#]/)
  return ext.substring(0, extEnd)
}
