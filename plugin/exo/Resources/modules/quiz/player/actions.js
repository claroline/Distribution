import {generateUrl} from './../../utils/routing'
import {makeActionCreator} from './../../utils/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER} from './../enums'

export const ITEMS_LOAD     = 'ITEMS_LOAD'
export const ATTEMPT_START  = 'ATTEMPT_START'
export const ATTEMPT_FINISH = 'ATTEMPT_FINISH'
export const ANSWERS_SUBMIT = 'ANSWERS_SUBMIT'

export const actions = {}

actions.loadItems = makeActionCreator(ITEMS_LOAD, 'items')

actions.playQuiz = (quizId) => {
  return function (dispatch) {
    return fetch(generateUrl('exercise_attempt_start', {exerciseId: quizId}), {credentials: 'include', method: 'POST'})
      .then(response => response.json())
      .then(json => {
          dispatch(actions.loadItems(json.items))
          dispatch(actions.startAttempt(json.paper))
          dispatch(quizActions.updateViewMode(VIEW_PLAYER))
      })

    // TODO : catch any error in the network call.
  }
}

actions.startAttempt = makeActionCreator(ATTEMPT_START, 'attempt')
actions.finishAttempt = makeActionCreator(ATTEMPT_FINISH, 'quiz')
actions.submitAnswers = makeActionCreator(ANSWERS_SUBMIT, 'quiz', 'paper')

