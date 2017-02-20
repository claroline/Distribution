export const utils = {}
import {actions as editorActions} from './../../../quiz/editor/actions'

utils.onFileSelect = (item, file) => {
  let img
  const reader = new window.FileReader()
  reader.onload = e => {
    img = document.createElement('img')
    img.src = e.target.result
    img.onload = () => {
      editorActions.updateContentItem(
        item.id,
        'file',
        'test'
      )
      console.log('done')
    }
  }
  reader.readAsDataURL(file)
}