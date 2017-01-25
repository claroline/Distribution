import {makeActionCreator} from './../../utils/actions'

export const QUESTIONS_SET = 'QUESTIONS_SET'

export const actions = {}

actions.setQuestions = makeActionCreator(QUESTIONS_SET, 'questions')
