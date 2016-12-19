import {makeReducer} from './../../utils/reducers'
import {getDefinition} from './../../items/item-types'

import {
  ITEMS_LOAD,
  ATTEMPT_START,
  ATTEMPT_FINISH,
  ANSWERS_SET,
  ANSWERS_SUBMIT,
  CURRENT_STEP_CHANGE
} from './actions'

function startAttempt(state, action) {
  return action.paper
}

function finishAttempt() {

}

function submitAnswers() {

}

function setAnswers(state, action) {
  return action.answers
}

function loadItems(state, action) {
  const items = {}
  
  for (let item in action.items) {
    if (action.items.hasOwnProperty(item)) {
      items[item] = getDefinition(action.items[item].type).player.decorate(action.items[item])
    }
  }

  return items
}

function changeCurrentStep(state, action) {
  return {
    id: action.id,
    number: action.number ? action.number : 1,
    tries: action.tries
  }
}

export const reducers = {
  items: makeReducer({}, {
    [ITEMS_LOAD]: loadItems
  }),
  paper: makeReducer({}, {
    [ATTEMPT_START]: startAttempt,
    [ATTEMPT_FINISH]: finishAttempt,
    [ANSWERS_SUBMIT]: submitAnswers
  }),
  answers: makeReducer([], {
    [ANSWERS_SET]: setAnswers
  }),
  currentStep: makeReducer({}, {
    [CURRENT_STEP_CHANGE]: changeCurrentStep
  })
}
