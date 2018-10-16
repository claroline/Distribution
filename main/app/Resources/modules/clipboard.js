import {trans} from '#/main/app/intl/translation'

function copy(toCopy) {
  let textArea = document.createElement('textarea')
  textArea.style.position = 'fixed'
  textArea.style.top = 0
  textArea.style.left = 0
  textArea.style.width = '1px'
  textArea.style.height = '1px'
  textArea.style.padding = 0
  textArea.style.border = 'none'
  textArea.style.outline = 'none'
  textArea.style.boxShadow = 'none'
  textArea.style.background = 'transparent'
  textArea.style.zIndex = -1000
  textArea.value = toCopy

  document.body.appendChild(textArea)

  textArea.select()

  try {
    document.execCommand('copy')
  } catch (error) {
    alert(trans('copy_to_clipboard_error'))
  }

  document.body.removeChild(textArea)
  alert(trans('copy_to_clipboard_success'))
}

export {
  copy
}
