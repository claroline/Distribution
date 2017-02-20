import cloneDeep from 'lodash/cloneDeep'
import {CONTENT_ITEM_CREATE} from './../../quiz/editor/actions'
import {makeActionCreator, makeId} from './../../utils/utils'
import {tex, trans} from './../../utils/translate'
import {TextContent as component} from './editor.jsx'
import {notBlank, setIfError} from './../../utils/validate'

const UPDATE_TEXT = 'UPDATE_TEXT'

export const actions = {
  updateText: makeActionCreator(UPDATE_TEXT, 'text')
}

function reduce(item = {}, action = {}) {
  switch (action.type) {
    case CONTENT_ITEM_CREATE:
      return Object.assign({}, item, {
        text: '',
        content: trans('text', {}, 'question_types'),
        solutions: 'none',
        score: {type: 'none'}
      })
    case UPDATE_TEXT:
      const newItem = cloneDeep(item)
      newItem['text'] = action.text
      return newItem
  }
  return item
}

function validate(item) {
  const errors = {}
  setIfError(errors, 'text', notBlank(item.text, true))

  return errors
}

export default {
  component,
  reduce,
  validate
}
