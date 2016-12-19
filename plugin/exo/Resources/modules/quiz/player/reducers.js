import {makeReducer} from './../../utils/reducers'

import {
  ATTEMPT_START,
  ATTEMPT_FINISH,
  ANSWERS_SUBMIT
} from './actions'

function startAttempt() {

}

function finishAttempt() {

}

function submitAnswers() {

}

export const reducers = {
  items: () => [], // FIXME
  attempt: makeReducer({}, {
    [ATTEMPT_START]: startAttempt,
    [ATTEMPT_FINISH]: finishAttempt,
    [ANSWERS_SUBMIT]: submitAnswers
  })
}
