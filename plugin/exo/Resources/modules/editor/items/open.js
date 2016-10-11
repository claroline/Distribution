import {Open as component} from './open.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'
import {tex} from './../lib/translate'

function reducer(open = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {

      return update(open, {
        score: {$set: 0},
        maxLength: {$set: 0}
      })
    }
  }
  return open
}

function initialFormValues(open) {
  return update(open, {
    score: {$set: open.score},
    maxLength: {$set: open.maxLength}
  })
}

function validateFormValues(values) {
  const errors = {open: []}
  if(!values.score || values.score <= 0){
    errors.score = tex('should_have_a_positive_score')
  }

  if(!values.maxLength || values.maxLength < 0){
    errors.score = tex('max_length_under_zero')
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
