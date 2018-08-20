import invariant from 'invariant'

import {makeActionCreator} from '#/main/app/store/actions'
import {selectors} from './selectors'
import {API_REQUEST} from '#/main/app/api'

export const CORRECTION_INIT = 'CORRECTION_INIT'
export const QUESTION_CURRENT = 'QUESTION_CURRENT'
export const SCORE_UPDATE = 'SCORE_UPDATE'
export const FEEDBACK_UPDATE = 'FEEDBACK_UPDATE'
export const REMOVE_ANSWERS = 'REMOVE_ANSWERS'

export const actions = {}

const initCorrection = makeActionCreator(CORRECTION_INIT, 'correction')
const setCurrentQuestionId = makeActionCreator(QUESTION_CURRENT, 'id')
const updateScore = makeActionCreator(SCORE_UPDATE, 'answerId', 'score')
const updateFeedback = makeActionCreator(FEEDBACK_UPDATE, 'answerId', 'feedback')
const removeAnswers = makeActionCreator(REMOVE_ANSWERS, 'questionId')

actions.fetchCorrection = quizId => ({
  [API_REQUEST]: {
    url: ['exercise_correction_questions', {exerciseId: quizId}],
    success: (data, dispatch) => {
      dispatch(initCorrection(data))
    }
  }
})

actions.displayQuestions = () => {
  return (dispatch, getState) => {
    if (!selectors.questionsFetched(getState())) {
      dispatch(actions.fetchCorrection(selectors.quizId(getState())))
    }
  }
}

actions.displayQuestionAnswers = id => {
  invariant(id, 'Question id is mandatory')
  return (dispatch, getState) => {
    if (!selectors.questionsFetched(getState())) {
      dispatch(actions.fetchCorrection(selectors.quizId(getState()))).then(() => {
        dispatch(setCurrentQuestionId(id)) // TODO : remove me : it's managed by router
      })
    } else {
      dispatch(setCurrentQuestionId(id)) // TODO : remove me : it's managed by router
    }
  }
}

actions.updateScore = (answerId, score) => {
  invariant(answerId, 'Answer id is mandatory')
  return (dispatch) => {
    dispatch(updateScore(answerId, score))
  }
}

actions.updateFeedback = (answerId, feedback) => {
  invariant(answerId, 'Answer id is mandatory')
  return (dispatch) => {
    dispatch(updateFeedback(answerId, feedback))
  }
}

actions.saveCorrection = (questionId) => {
  return (dispatch, getState) => {
    const state = getState()
    const question = selectors.currentQuestion(state)
    const validAnswers = selectors.answers(state).filter(a =>
      a.questionId === questionId && a.score !== undefined && a.score !== null && !isNaN(a.score) && a.score.trim() !== '' && a.score <= question.score.max
    )
    const answers = validAnswers.map(a => {
      return Object.assign({}, a, {
        score: parseFloat(a.score),
        type: question.type
      })
    })
    dispatch({
      [API_REQUEST]: {
        url: ['exercise_correction_save', {exerciseId: selectors.quizId(state), questionId: questionId}],
        request: {
          method: 'PUT' ,
          body: JSON.stringify(answers)
        },
        success: () => dispatch(removeAnswers(questionId))
      }
    })
  }
}
