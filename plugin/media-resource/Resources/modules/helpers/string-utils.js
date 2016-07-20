export default class StringUtils {
  html_decode(string) {
    return string.replace(/&quot;/g, '"').replace(/&#039;/g, '\'').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  }

  html_encode(string) {
    return string.replace('"', /&quot;/g).replace('\'', /&#039;/g).replace('<', /&lt;/g).replace('>', /&gt;/g).replace('&', /&amp;/g)
  }

  removeHtml(string) {
    return string.replace(/<[^>]+>/g, '')
  }

  createGuid() {
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
    return uuid.toUpperCase()
  }
}
