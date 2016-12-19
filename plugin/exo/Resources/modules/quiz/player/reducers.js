import {makeReducer} from './../../utils/reducers'

import {
  ATTEMPT_START,
  ATTEMPT_FINISH,
  ANSWERS_SUBMIT}  from './actions'

function startAttempt(attemptState, action) {

}

function finishAttempt(attemptState, action) {

}

function submitAnswers(attemptState, action) {

}

export const reducers = {
  items: () => [], // FIXME
  attempt: makeReducer({}, {
    [ATTEMPT_START]: startAttempt,
    [ATTEMPT_FINISH]: finishAttempt,
    [ANSWERS_SUBMIT]: submitAnswers
  })
}
