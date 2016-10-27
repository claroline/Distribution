import {Match as component} from './match.jsx'
import {ITEM_CREATE} from './../actions'
import {makeId, update} from './../util'


function reducer(question = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {

      return update(question, {
        firstSet: {$set: [
          {
            id: '2',
            type: 'text/plain',
            data: 'Item A'
          },
          {
            id: '3',
            type: 'text/plain',
            data: 'Item B'
          }
        ]},
        secondSet: {$set: [
          {
            id: '4',
            type: 'text/html',
            data: 'Item C'
          },
          {
            id: '5',
            type: 'text/plain',
            data: 'Item D'
          }
        ]},
        solutions: {$set: [
          {
            firstId: '2',
            secondId: '5',
            score: 3,
            feedback: 'Well done!'
          },
          {
            firstId: '3',
            secondId: '4',
            score: 1,
            feedback: 'That was easy.'
          }
        ]},
        random: {$set: false},
        penalty: {$set: 0}
      })
    }
  }
  return question
}

function initialFormValues(question) {
  return update(question, {
    firstSet: {$set: question.firstSet},
    secondSet: {$set: question.secondSet},
    solutions: {$set: question.solutions},
    random: {$set: question.random},
    penalty: {$set: question.penalty}
  })
}

export function makeNewItem(){
  return {
    id: makeId(),
    type: 'text/plain',
    data: 'Item D'
  }
}

function validateFormValues() {
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
