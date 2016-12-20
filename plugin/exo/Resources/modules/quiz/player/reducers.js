import {makeReducer} from './../../utils/reducers'

import {
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

function changeCurrentStep(state, action) {
  return action.id
}

export const reducers = {
  paper: makeReducer({}, {
    [ATTEMPT_START]: startAttempt,
    [ATTEMPT_FINISH]: finishAttempt,
    [ANSWERS_SUBMIT]: submitAnswers
  }),
  answers: makeReducer([], {
    [ANSWERS_SET]: setAnswers
  }),
  currentStep: makeReducer(null, {
    [CURRENT_STEP_CHANGE]: changeCurrentStep
  })
}
