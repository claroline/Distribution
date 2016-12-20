import {update} from './../../utils/utils'
import {makeReducer} from './../../utils/reducers'
import {decorateAnswer} from './decorators'

import {
  ATTEMPT_START,
  STEP_OPEN,
  ANSWER_UPDATE
} from './actions'

function setPaper(state, action) {
  return action.paper
}

function setAnswers(state, action) {
  return action.answers
}

function updateAnswer(state, action) {
  return update(state, {[action.questionId]: {$merge: { data: action.answerData, _touched: true }}})
}

function initCurrentStepAnswers(state, action) {
  const newAnswers = action.items.reduce((acc, itemId) => {
    if (!state[itemId]) {
      acc[itemId] = decorateAnswer({ questionId: itemId, _touched: true })
    }
    
    return acc
  }, {})

  return update(state, {$merge: newAnswers})
}

function setCurrentStep(state, action) {
  return action.id
}

export const reducers = {
  paper: makeReducer({}, {
    [ATTEMPT_START]: setPaper
  }),
  answers: makeReducer({}, {
    [STEP_OPEN]: initCurrentStepAnswers,
    [ATTEMPT_START]: setAnswers,
    [ANSWER_UPDATE]: updateAnswer
  }),
  currentStep: makeReducer(null, {
    [STEP_OPEN]: setCurrentStep
  })
}
