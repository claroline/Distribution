import invariant from 'invariant'
import {makeActionCreator} from './../../utils/utils'
import {actions as baseActions} from './../actions'
import {VIEW_CORRECTION_QUESTIONS, VIEW_CORRECTION_ANSWERS} from './../enums'

export const QUESTION_CURRENT = 'QUESTION_CURRENT'
export const SAVE_CORRECTION_ENABLE = 'SAVE_CORRECTION_ENABLE'
export const SCORE_UPDATE = 'SCORE_UPDATE'

export const actions = {}

const setCurrentQuestion = makeActionCreator(QUESTION_CURRENT, 'id')
const enableSaveCorrection = makeActionCreator(SAVE_CORRECTION_ENABLE, 'enabled')
const updateScore = makeActionCreator(SCORE_UPDATE, 'answerId', 'score')

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

actions.enableSaveCorrection = (enabled) => {
  invariant(enabled, 'enabled is mandatory')
  return (dispatch, getState) => {
    dispatch(enableSaveCorrection(enabled))
  }
}

actions.updateScore = (answerId, score) => {
  invariant(answerId, 'Answer id is mandatory')
  return (dispatch, getState) => {
    dispatch(updateScore(answerId, score))
  }
}