import {Open as component} from './open.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'
import {notBlank, number, gteZero} from './../lib/validate'

function reducer(item = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return update(open, {
        maxScore: {$set: 0},
        maxLength: {$set: 0}
      })
    }
  }
  return item
}

function initialFormValues(item) {
  return update(item, {
    maxScore: {$set: item.score.max}
  })
}

function validateFormValues(values) {
  return {
    maxScore: notBlank(values.maxScore)
      || number(values.maxScore)
      || gteZero(values.maxScore)
  }
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
