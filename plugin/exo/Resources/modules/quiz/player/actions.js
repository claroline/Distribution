import {generateUrl} from './../../utils/routing'
import {makeActionCreator} from './../../utils/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER} from './../enums'
import {normalize} from './normalizer'

export const ATTEMPT_START = 'ATTEMPT_START'
export const STEP_OPEN     = 'STEP_OPEN'
export const ANSWER_UPDATE = 'ANSWER_UPDATE'

export const actions = {}

// TODO : display loader on ajax call
// TODO : catch any error in the network call.

actions.playQuiz = (quizId) => {
  return function (dispatch) {
    return fetch(generateUrl('exercise_attempt_start', {exerciseId: quizId}), {
      credentials: 'include',
      method: 'POST'
    })
    .then(response => response.json())
    .then(json => {
      const normalized = normalize(json)

      dispatch(actions.startAttempt(normalized.paper, normalized.answers))

      const firstStep = normalized.paper.structure[0]
      dispatch(actions.openStep(firstStep.id, firstStep.items))
      dispatch(quizActions.updateViewMode(VIEW_PLAYER))
    })
  }
}

actions.submitQuiz = (quizId, paperId, answers, nextActions) => {
  return function (dispatch) {
    const answerRequest = []
    for (let answer in answers) {
      if (answers.hasOwnProperty(answer) && answers[answer]._touched) {
        // Answer has been modified => send it to the server
        answerRequest.push(answers[answer])
      }
    }

    if (0 !== answerRequest.length) {
      return fetch(generateUrl('exercise_attempt_submit', {exerciseId: quizId, id: paperId}), {
        credentials: 'include',
        method: 'PUT',
        body: JSON.stringify(answerRequest)
      })
      .then(() => {
        if (nextActions) {
          nextActions(dispatch)
        }
      })

      // TODO : catch any error in the network call.
    } else {
      nextActions(dispatch)
    }
  }
}

actions.finishQuiz = (quizId, paperId, nextActions) => {
  return function (dispatch) {
    return fetch(generateUrl('exercise_attempt_finish', {exerciseId: quizId, id: paperId}), {
      credentials: 'include',
      method: 'PUT'
    })
    .then(() => {
      nextActions(dispatch)
    })
  }
}

actions.startAttempt = makeActionCreator(ATTEMPT_START, 'paper', 'answers')
actions.updateAnswer = makeActionCreator(ANSWER_UPDATE, 'questionId', 'answerData')
actions.openStep = makeActionCreator(STEP_OPEN, 'id', 'items')
