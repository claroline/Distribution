import {trans} from './translate'
import {extractTextFromHtml} from './../util'

const tval = msg => trans(msg, {}, 'validators')

export function notBlank(value, isHtml = false) {
  if (!value || isHtml && !extractTextFromHtml(value)) {
    return tval('This value should not be blank.')
  }
}
