import {makeActionCreator} from './../../utils/actions'

export const ATTEMPT_START = 'ATTEMPT_START'
export const ATTEMPT_FINISH = 'ATTEMPT_FINISH'
export const ANSWERS_SUBMIT = 'ANSWERS_SUBMIT'

export const actions = {}

actions.startAttempt = makeActionCreator(ATTEMPT_START, 'quiz', 'user')
actions.finishAttempt = makeActionCreator(ATTEMPT_FINISH, 'quiz', 'user')
actions.submitAnswers = makeActionCreator(ANSWERS_SUBMIT, 'quiz', 'paper', 'user')

