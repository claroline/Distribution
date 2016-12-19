import {generateUrl} from './../../utils/routing'
import {makeActionCreator} from './../../utils/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER} from './../enums'
import {normalize} from './normalizer'

export const ITEMS_LOAD     = 'ITEMS_LOAD'
export const ATTEMPT_START  = 'ATTEMPT_START'
export const ATTEMPT_FINISH = 'ATTEMPT_FINISH'

export const ANSWER_UPDATE  = 'ANSWER_UPDATE'
export const ANSWERS_SET    = 'ANSWERS_SET'
export const ANSWERS_SUBMIT = 'ANSWERS_SUBMIT'

export const CURRENT_STEP_CHANGE = 'CURRENT_STEP_CHANGE'

export const actions = {}

actions.loadItems = makeActionCreator(ITEMS_LOAD, 'items')

actions.playQuiz = (quizId) => {
  return function (dispatch) {
    return fetch(generateUrl('exercise_attempt_start', {exerciseId: quizId}), {credentials: 'include', method: 'POST'})
      .then(response => response.json())
      .then(json => {
        const normalized = normalize(json)

        dispatch(actions.loadItems(normalized.items))
        dispatch(actions.startAttempt(normalized.paper))
        dispatch(actions.setAnswers(normalized.answers))
        dispatch(actions.changeCurrentStep(normalized.paper.structure[0].id, 1, 1))
        dispatch(quizActions.updateViewMode(VIEW_PLAYER))
      })

    // TODO : catch any error in the network call.
  }
}

actions.startAttempt = makeActionCreator(ATTEMPT_START, 'paper')
actions.finishAttempt = makeActionCreator(ATTEMPT_FINISH, 'quiz')
actions.submitAnswers = makeActionCreator(ANSWERS_SUBMIT, 'quiz', 'paper')
actions.updateAnswer = makeActionCreator(ANSWER_UPDATE, 'questionId', 'answerData')
actions.setAnswers = makeActionCreator(ANSWERS_SET, 'answers')
actions.changeCurrentStep = makeActionCreator(CURRENT_STEP_CHANGE, 'id', 'number', 'tries')
