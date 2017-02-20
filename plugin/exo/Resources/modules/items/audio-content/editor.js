import {CONTENT_ITEM_CREATE} from './../../quiz/editor/actions'
import {trans} from './../../utils/translate'
import {AudioContent as component} from './editor.jsx'

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case CONTENT_ITEM_CREATE:
      return Object.assign({}, item, {
        text: '',
        content: trans('audio', {}, 'question_types'),
        solutions: 'none',
        score: {type: 'none'}
      })
  }
  return item
}

function validate(item) {

  return {}
}

export default {
  component,
  reduce,
  validate
}
