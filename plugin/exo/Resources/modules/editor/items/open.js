import {Open as component} from './open.jsx'
import {ITEM_CREATE} from './../actions'
import {notBlank, number, gteZero} from './../lib/validate'
import {makeActionCreator} from './../util'
import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'
import set from 'lodash/set'

const UPDATE_OPEN = 'UPDATE_OPEN'

export const actions = {
  updateOpen: makeActionCreator(UPDATE_OPEN, 'id', 'property', 'value')
}

function reduce(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return Object.assign({}, item, {
        maxScore: 0,
        maxLength: 0
      })
    }

    case UPDATE_OPEN: {
      const newItem = cloneDeep(item)
      newItem._touched = merge(
        newItem._touched || {},
        set({}, action.property, true)
      )
      const newValue = parseFloat(action.value)
      if(action.property === 'maxScore'){
        newItem.maxScore = newValue
      } else if(action.property === 'maxLength'){
        newItem.maxLength = newValue
      }
      return newItem
    }
  }
  return item
}


function validate(values) {
  let errors = {}
  if(undefined !== notBlank(values.maxScore)){
    errors =  {
      maxScore: notBlank(values.maxScore)
    }
  } else if(undefined !== number(values.maxScore)){
    errors = {
      maxScore : number(values.maxScore)
    }
  } else if(undefined !== gteZero(values.maxScore)){
    errors = {
      maxScore : gteZero(values.maxScore)
    }
  }

  if(undefined !== notBlank(values.maxLength)){
    errors =  {
      maxLength: notBlank(values.maxLength)
    }
  } else if(undefined !== number(values.maxLength)){
    errors = {
      maxLength : number(values.maxLength)
    }
  } else if(undefined !== gteZero(values.maxLength)){
    errors = {
      maxLength : gteZero(values.maxLength)
    }
  }
  return errors
}

export default {
  type: 'application/x.open+json',
  name: 'open',
  component,
  reduce,
  validate
}
