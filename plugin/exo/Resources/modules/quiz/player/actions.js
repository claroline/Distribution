import {makeActionCreator} from './../../utils/actions'
import {actions as apiActions} from './../../api/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER} from './../enums'
import quizSelectors from './../selectors'
import {navigate} from './../router'
import {select as playerSelectors} from './selectors'
import {api} from './api'
import {generatePaper} from './../papers/generator'

export const ATTEMPT_START  = 'ATTEMPT_START'
export const ATTEMPT_FINISH = 'ATTEMPT_FINISH'
export const STEP_OPEN      = 'STEP_OPEN'
export const ANSWER_UPDATE  = 'ANSWER_UPDATE'
export const ANSWERS_SUBMIT = 'ANSWERS_SUBMIT'
export const TEST_MODE_SET  = 'TEST_MODE_SET'
export const HINT_USE       = 'HINT_USE'

export const actions = {}

actions.setTestMode = makeActionCreator(TEST_MODE_SET, 'testMode')
actions.startAttempt = makeActionCreator(ATTEMPT_START, 'paper', 'answers')
actions.finishAttempt = makeActionCreator(ATTEMPT_FINISH, 'paper')
actions.openStep = makeActionCreator(STEP_OPEN, 'step')
actions.updateAnswer = makeActionCreator(ANSWER_UPDATE, 'questionId', 'answerData')
actions.submitAnswers = makeActionCreator(ANSWERS_SUBMIT, 'quizId', 'paperId', 'answers')
actions.useHint = makeActionCreator(HINT_USE, 'questionId', 'hintId')

actions.play = (previousPaper = null, testMode = false) => {
  return (dispatch, getState) => {
    dispatch(actions.setTestMode(testMode))

    if (!playerSelectors.offline(getState())) {
      // Request a paper from the API and open the player
      return dispatch(
        apiActions.sendRequest(['exercise_attempt_start', {exerciseId: quizSelectors.quiz(getState()).id}], {method: 'POST'})
      ).then(data => dispatch(initPlayer(data.paper, data.answers)))
    } else {
      // Create a new local paper and open the player
      return dispatch(
        initPlayer(generatePaper(
          quizSelectors.quiz(getState()),
          quizSelectors.steps(getState()),
          previousPaper
        ))
      )
    }
  }
}

actions.submit = (quizId, paperId, answers = null) => {
  return (dispatch, getState) => {
    let answersPromise
    if (answers && !playerSelectors.offline(getState())) {
      // Send answers to the API

      const answerRequest = []
      for (let answer in answers) {
        if (answers.hasOwnProperty(answer) && answers[answer]._touched) {
          // Answer has been modified => send it to the server
          answerRequest.push(answers[answer])
        }
      }

      dispatch(
        apiActions.sendRequest(
          ['exercise_attempt_submit', {exerciseId: quizId, id: paperId}],
          {body: JSON.stringify(answerRequest)}
        )
      )
    } else {
      // Nothing to do
      answersPromise = Promise.resolve()
    }

    return answersPromise.then(() =>
      answers ? dispatch(actions.submitAnswers(quizId, paperId, answers)) : null
    )
  }
}

actions.finish = (quizId, paper, pendingAnswers = null) => {
  return (dispatch, getState) => {
    // First, submit answers for the current step
    dispatch(actions.submit(quizId, paper.id, pendingAnswers)).then(() => {
      let paperPromise
      if (!playerSelectors.offline(getState())) {
        // Send finish request to API
        paperPromise = api.finishAttempt(quizId, paper.id)
      } else {
        // Just resolve the current paper (the next actions will mark it as finished)
        paperPromise = Promise.resolve({paper: paper})
      }

      return paperPromise.then((normalizedData) =>
        // Finish the attempt and use quiz config to know what to do next
        dispatch(actions.handleAttemptEnd(normalizedData.paper))
      )
    })
  }
}

actions.navigateTo = (quizId, paperId, nextStep, pendingAnswers = null) => {
  return (dispatch) => {
    // Submit answers for the current step
    dispatch(actions.submit(quizId, paperId, pendingAnswers)).then(() =>
      // Open the requested step
      dispatch(actions.openStep(nextStep))
    )
  }
}

actions.handleAttemptEnd = (paper) => {
  return (dispatch) => {
    // Finish the current attempt
    dispatch(actions.finishAttempt(paper))

    // We will decide here if we show the correction now or not and where we redirect the user

    navigate('overview')
  }
}

function initPlayer(paper, answers = {}) {
  return (dispatch) => {
    dispatch(actions.startAttempt(paper, answers))

    const firstStep = paper.structure[0]

    dispatch(actions.openStep(firstStep))
    dispatch(quizActions.updateViewMode(VIEW_PLAYER))
  }
}

actions.showHint = (hint) => {
  return (dispatch, getState) => {
    let hintPromise
    if (shouldCallServer(getState())) {
      hintPromise = api.showHint(hint.id)
    } else {
      hintPromise = Promise.resolve(hint)
    }

    return hintPromise.then((hint) =>
      // Finish the attempt and use quiz config to know what to do next
      dispatch(actions.useHint(hint.id))
    )
  }
}
