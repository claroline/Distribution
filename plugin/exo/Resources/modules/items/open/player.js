import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'
import {Open as component} from './player.jsx'
import {ITEM_OPEN} from './../../quiz/player/actions'
import {makeActionCreator} from './../../utils/utils'

const UPDATE_ANSWER = 'UPDATE_ANSWER'

export const actions = {
  answerUpdate: makeActionCreator(UPDATE_ANSWER, 'value')
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_OPEN: {
      return Object.assign({}, item, {
        data:'',
        maxLength: item.maxLength || 0
      })
    }
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


function validate(item) {
  const errors = {}
  // @TODO check if answer length is inferior to maxLength (if setted)
  if(item.maxLength > 0 && item.data.length > item.maxLength){
    errors.item = 'too long'
  }

  return errors
}

export default {
  component,
  reduce,
  validate
}
