// This implementation currently can represent only empty FileLists.
// https://w3c.github.io/FileAPI/#filelist-section
function FileList() {
  this.length = 0
}

FileList.prototype.item = function () {
  return null
}

export default FileList
