import {Pair as component} from './pair.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'

function reducer(question = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {

      return update(question, {
        pairs: {$set: []},
        odd: {$set: []},
        solutions: {$set: []}
      })
    }
  }
  return question
}

function initialFormValues(question) {
  return update(question, {
    pairs: {$set: question.pairs},
    odd: {$set: question.odd},
    solutions: {$set: question.solutions}
  })
}

function validateFormValues(values) {
  const errors = {}
  return errors
}

export default {
  type: 'application/x.pair+json',
  name: 'pair',
  question: true,
  component,
  reducer,
  initialFormValues,
  validateFormValues
}
