import {Match as component} from './match.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'


function reducer(question = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {

      return update(question, {
        firstSet: {$set: []},
        secondSet: {$set: []},
        solutions: {$set: []}
      })
    }
  }
  return question
}

function initialFormValues(question) {
  return update(question, {
    firstSet: {$set: question.firstSet},
    secondSet: {$set: question.secondSet},
    solutions: {$set: question.solutions}
  })
}

function validateFormValues(values) {
  const errors = {}
  return errors
}

export default {
  type: 'application/x.match+json',
  name: 'match',
  question: true,
  component,
  reducer,
  initialFormValues,
  validateFormValues
}
