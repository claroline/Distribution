import {Open as component} from './open.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'

function reducer(open = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {

      return update(open, {
        score: {$set: 0}
      })
    }
  }
  return open
}

function initialFormValues(open) {
  return update(open, {
    score: {$set: open.score}
  })
}

function validateFormValues(values) {
  const errors = {open: []}

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
