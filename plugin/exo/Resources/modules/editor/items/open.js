import {Open as component} from './open.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'
import {tex} from './../lib/translate'

function reducer(open = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {

      return update(open, {
        maxScore: {$set: 0},
        maxLength: {$set: 0}
      })
    }
  }
  return open
}

function initialFormValues(open) {
  return update(open, {
    maxScore: {$set: open.maxScore},
    maxLength: {$set: open.maxLength}
  })
}

function validateFormValues(values) {
  const errors = {open: []}
  if(values.maxScore < 0){
    errors.maxScore = tex('should_be_greater_or_equal_to_zero')
  }

  if(!values.maxLength || values.maxLength < 0){
    errors.maxLength = tex('should_be_greater_or_equal_to_zero')
  }
  return errors
}

export default {
  type: 'application/x.open+json',
  name: 'open',
  question: true,
  component,
  reducer,
  initialFormValues,
  validateFormValues
}
