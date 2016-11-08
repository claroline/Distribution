import {makeActionCreator} from './../../utils/actions'

export const CURRENT_QUESTION_SET = 'CURRENT_QUESTION_SET'
export const CURRENT_QUESTION_UNSET = 'CURRENT_QUESTION_UNSET'

export const actions = {}

actions.setCurrentQuestion = makeActionCreator(CURRENT_QUESTION_SET, 'questionId')
actions.unsetCurrentQuestion = makeActionCreator(CURRENT_QUESTION_UNSET)