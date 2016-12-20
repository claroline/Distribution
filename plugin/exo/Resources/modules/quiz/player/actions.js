import {generateUrl} from './../../utils/routing'
import {makeActionCreator} from './../../utils/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER} from './../enums'
import {normalize} from './normalizer'

export const PAPER_SET           = 'PAPER_SET'

export const ANSWERS_SET         = 'ANSWERS_SET'
export const ANSWERS_INIT        = 'ANSWERS_INIT'
export const ANSWER_ADD          = 'ANSWER_ADD'
export const ANSWER_UPDATE       = 'ANSWER_UPDATE'

export const CURRENT_STEP_CHANGE = 'CURRENT_STEP_CHANGE'

export const actions = {}

actions.playQuiz = (quizId) => {
  return function (dispatch) {
    return fetch(generateUrl('exercise_attempt_start', {exerciseId: quizId}), {
        credentials: 'include',
        method: 'POST'
      })
      .then(response => response.json())
      .then(json => {
        const normalized = normalize(json)

        dispatch(actions.setPaper(normalized.paper))
        dispatch(actions.setAnswers(normalized.answers))
        
        dispatch(actions.navigateTo(normalized.paper.structure[0].id))
        dispatch(quizActions.updateViewMode(VIEW_PLAYER))
      })

    // TODO : catch any error in the network call.
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

    return fetch(generateUrl('exercise_attempt_submit', {exerciseId: quizId, id: paperId}), {
        credentials: 'include',
        method: 'PUT',
        body: answerRequest
      })
      .then(response => response.json())
      .then(() => {
        if (nextActions) {
          nextActions(dispatch)
        }
      })

    // TODO : catch any error in the network call.
  }
}

actions.finishQuiz = (quizId, paperId) => {
  return function (dispatch) {
    return fetch(generateUrl('exercise_attempt_finish', {exerciseId: quizId, id: paperId}), {
      credentials: 'include',
      method: 'PUT'
    })
      .then(response => response.json())
      .then(json => {
        const normalized = normalize(json)

        dispatch(actions.setPaper(normalized.paper))
        dispatch(actions.setAnswers(normalized.answers))
      })

    // TODO : catch any error in the network call.
  }
}

actions.navigateTo = (step) => {
  return function (dispatch) {
    // Change the current step
    dispatch(actions.changeCurrentStep(step.id))

    // Initialize answers
    dispatch(actions.initAnswers(stepId))
  }
}

actions.setPaper = makeActionCreator(PAPER_SET, 'paper')
actions.addAnswer = makeActionCreator(ANSWER_ADD, 'questionId', 'answerData')
actions.updateAnswer = makeActionCreator(ANSWER_UPDATE, 'questionId', 'answerData')
actions.initAnswers = makeActionCreator(ANSWERS_INIT, 'stepId')
actions.setAnswers = makeActionCreator(ANSWERS_SET, 'answers')
actions.changeCurrentStep = makeActionCreator(CURRENT_STEP_CHANGE, 'id')
