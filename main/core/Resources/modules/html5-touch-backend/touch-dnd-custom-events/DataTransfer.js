import FileList from './FileList'
import {default as parseTextUriList} from './parseTextUriList'

// DataTransfer objects expose the drag data store
// https://html.spec.whatwg.org/multipage/interaction.html#datatransferitem
function DataTransfer(store) {
  this.store = store
  this.typeTable = {}
  this.effectAllowed = 'uninitialized'
  this.types = []
  this.files = new FileList()
}

DataTransfer.prototype.setDragImage = function (element, x, y) {
  if (!this.store) { return }
  if (this.store.mode !== 'readwrite') { return }

  const preview = element.cloneNode(true)
  preview.width = element.clientWidth
  preview.height = element.clientHeight
  preview.dragPointOffsetX = -x
  preview.dragPointOffsetY = -y

  this.store.dragPreviewElement = preview
}

DataTransfer.prototype.getData = function (format) {
  if (this.store.mode === 'protected') { return '' }

  format = format.toLowerCase()

  let convertToUrl = false
  if (format === 'text') {
    format = 'text/plain'
  } else if (format === 'url') {
    format = 'text/uri-list'
    convertToUrl = true
  }

  if (!(format in this.typeTable)) { return '' }

  let result = this.typeTable[format]
  if (convertToUrl) {
    // set result to the first URL from the list,;
    // if any, or the empty string otherwise. [RFC2483];
    result = parseTextUriList(result)[0] || ''
  }

  return result
}

DataTransfer.prototype.setData = function (format, data) {
  if (!this.store) { return }
  if (this.store.mode !== 'readwrite') { return }

  format = format.toLowerCase()

  if (format === 'text') {
    format = 'text/plain'
  } else if (format === 'url') {
    format = 'text/uri-list'
  }

  this.typeTable[format] = data
  this.types = Object.keys(this.typeTable)
}

DataTransfer.prototype.clearData = function (format) {
  const self = this

  if (!this.store) { return }
  if (this.store.mode !== 'readwrite') { return }

  if (typeof format === 'undefined') {
    // Clear all formats (except "Files");
    this.types
      .filter(function (type) { return type !== 'Files' })
      .forEach(function (type) { return self.clearData(type) })

    return
  }

  format = format.toLowerCase()

  if (format === 'text') {
    format = 'text/plain'
  } else if (format === 'url') {
    format = 'text/uri-list'
  }

  delete this.typeTable[format]
  this.types = Object.keys(this.typeTable)
}

export default DataTransfer
