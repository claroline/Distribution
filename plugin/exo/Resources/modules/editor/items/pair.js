import {Pair as component} from './pair.jsx'
import {ITEM_CREATE} from './../actions'
import {update} from './../util'

function reducer(question = {}, action) {
  switch (action.type) {
    case ITEM_CREATE: {
      return update(question, {
        left: {$set: [
          {
            id: 3,
            type: 'text/plain',
            data: 'Item A'
          },
          {
            id: 4,
            type: 'text/html',
            data: 'Item B'
          },
          {
            id: 5,
            type: 'text/html',
            data: 'Item C'
          }
        ]},
        right: {$set: [
          {
            id: 4,
            type: 'text/plain',
            data: 'Item X'
          },
          {
            id: 5,
            type: 'text/plain',
            data: 'Item Y'
          }
        ]},
        solutions: {$set: [
          {
            leftId: 3,
            rightId: 4,
            score: 0.5,
            feedback:'Well that is right!'
          },
          {
            leftId: 4,
            rightId: 5,
            score: 1,
            feedback:'Awesome dude!'
          }
        ]},
        random: {$set:false},
        penalty:{$set:0.5}
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

function validateFormValues() {
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
