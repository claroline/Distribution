import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'
import {Open as component} from './player.jsx'
import {makeActionCreator} from './../../utils/utils'

const UPDATE_ANSWER = 'UPDATE_ANSWER'

export const actions = {
  answerUpdate: makeActionCreator(UPDATE_ANSWER, 'value')
}

function reduce(item = {}, action) {
  switch (action.type) {
    case UPDATE_ANSWER: {
      const newItem = cloneDeep(item)
      newItem._touched = merge(
        newItem._touched || {},
        set({}, 'data', true)
      )
      newItem['data'] = action.value
      return newItem
    }
  }
  return item
}


function validate(item, answer) {
  const errors = {}

  switch (item.contentType) {
    case 'text':
    default:
      if(item.maxLength > 0 && answer.length > item.maxLength){
        errors.item = 'too long'
      }
      break
  }

  return errors
}

export default {
  component,
  reduce,
  validate
}
