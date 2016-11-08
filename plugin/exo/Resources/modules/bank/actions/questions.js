import {makeActionCreator} from './../../utils/actions'

export const QUESTION_REQUEST = 'QUESTION_REQUEST'
export const QUESTION_CREATE = 'QUESTION_CREATE'
export const QUESTION_UPDATE = 'QUESTION_UPDATE'
export const QUESTION_DELETE = 'QUESTION_DELETE'

export const actions = {}

actions.select = makeActionCreator(QUESTION_REQUEST)
actions.selectItem = makeActionCreator(QUESTION_CREATE)
actions.deselectItem = makeActionCreator(QUESTION_UPDATE, 'question')
actions.deselectAll = makeActionCreator(QUESTION_DELETE, 'questionId')