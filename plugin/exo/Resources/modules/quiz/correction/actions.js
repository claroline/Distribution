import invariant from 'invariant'
import {makeActionCreator} from './../../utils/utils'
import {actions as baseActions} from './../actions'
import {VIEW_CORRECTION_QUESTIONS, VIEW_CORRECTION_ANSWERS} from './../enums'

export const QUESTION_CURRENT = 'QUESTION_CURRENT'

export const actions = {}

const setCurrentQuestion = makeActionCreator(QUESTION_CURRENT, 'id')

actions.displayQuestions = () => {
  return (dispatch, getState) => {
    dispatch(baseActions.updateViewMode(VIEW_CORRECTION_QUESTIONS))
  }
}

actions.displayQuestionAnswers = id => {
  invariant(id, 'Question id is mandatory')
  return (dispatch, getState) => {
    dispatch(setCurrentQuestion(id))
    dispatch(baseActions.updateViewMode(VIEW_CORRECTION_ANSWERS))
  }
}