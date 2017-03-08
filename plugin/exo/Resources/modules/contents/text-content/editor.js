import cloneDeep from 'lodash/cloneDeep'
import {makeActionCreator} from './../../utils/utils'
import {TextContent as component} from './editor.jsx'
import {notBlank, setIfError} from './../../utils/validate'

const UPDATE_ITEM_CONTENT_TEXT = 'UPDATE_ITEM_CONTENT_TEXT'

export const actions = {
  updateItemContentText: makeActionCreator(UPDATE_ITEM_CONTENT_TEXT, 'data')
}

function reduce(item = {}, action = {}) {
  let newItem

  switch (action.type) {
    case UPDATE_ITEM_CONTENT_TEXT:
      newItem = cloneDeep(item)
      newItem['data'] = action.data
      return newItem
  }
  return item
}

function validate(item) {
  const errors = {}
  setIfError(errors, 'data', notBlank(item.data, true))

  return errors
}

export default {
  component,
  reduce,
  validate
}
