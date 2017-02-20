import {CONTENT_ITEM_CREATE} from './../../quiz/editor/actions'
import {makeActionCreator} from './../../utils/utils'
import {trans} from './../../utils/translate'
import {ImageContent as component} from './editor.jsx'

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case CONTENT_ITEM_CREATE:
      return Object.assign({}, item, {
        content: trans('image', {}, 'question_types'),
        solutions: 'none',
        score: {type: 'none'},
        file: action.file
      })
  }
  return item
}

function validate() {
  return {}
}

export default {
  component,
  reduce,
  validate
}
