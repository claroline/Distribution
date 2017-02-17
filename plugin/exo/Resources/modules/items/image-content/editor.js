import cloneDeep from 'lodash/cloneDeep'
import {CONTENT_ITEM_CREATE, UPDATE_PROP} from './../../quiz/editor/actions'
import {makeId} from './../../utils/utils'
import {trans} from './../../utils/translate'
import {TextContent as component} from './editor.jsx'

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case CONTENT_ITEM_CREATE:
      return Object.assign({}, item, {
        text: '',
        content: trans('text', {}, 'question_types'),
        solutions: 'none',
        score: {type: 'none'}
      })
    case UPDATE_PROP:
      const newItem = cloneDeep(item)
      newItem[action.property] = action.value
      return newItem
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
