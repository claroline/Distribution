import {makeId} from './../../../utils/utils'

export const utils = {}

utils.onFileSelect = (file, data) => {
  const img = document.createElement('img')
  img.src = data

  return {
    id: makeId(),
    type: file.type,
    data: data,
    name: file.name,
    width: img.naturalWidth,
    height: img.naturalHeight,
    _clientWidth: img.width,
    _clientHeight: img.height,
    _size: file.size
  }
}