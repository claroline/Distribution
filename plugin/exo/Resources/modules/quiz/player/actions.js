import {makeActionCreator} from './../../utils/actions'
import {actions as quizActions} from './../actions'
import {VIEW_PLAYER, VIEW_OVERVIEW} from './../enums'
import {api} from './api'
import {generatePaper} from './../papers/generator'

export const ATTEMPT_START  = 'ATTEMPT_START'
export const ATTEMPT_FINISH = 'ATTEMPT_FINISH'
export const STEP_OPEN      = 'STEP_OPEN'
export const ANSWER_UPDATE  = 'ANSWER_UPDATE'
export const ANSWERS_SUBMIT = 'ANSWERS_SUBMIT'
export const TEST_MODE_SET  = 'TEST_MODE_SET'

export const actions = {}

function shouldCallServer(state) {
  // TODO : use selector here
  return !state.noServer && !state.testMode
}

function initPlayer(paper, answers = {}) {
  return (dispatch) => {
    dispatch(actions.startAttempt(paper, answers))

    const firstStep = paper.structure[0]

    dispatch(actions.openStep(firstStep))
    dispatch(quizActions.updateViewMode(VIEW_PLAYER))
  }
}

actions.setTestMode = makeActionCreator(TEST_MODE_SET, 'testMode')
actions.startAttempt = makeActionCreator(ATTEMPT_START, 'paper', 'answers')
actions.finishAttempt = makeActionCreator(ATTEMPT_FINISH, 'paper')
actions.openStep = makeActionCreator(STEP_OPEN, 'step')
actions.updateAnswer = makeActionCreator(ANSWER_UPDATE, 'questionId', 'answerData')
actions.submitAnswers = makeActionCreator(ANSWERS_SUBMIT, 'quizId', 'paperId', 'answers')

actions.play = (quiz, steps, previousPaper = null, testMode = false) => {
  return (dispatch, getState) => {
    dispatch(actions.setTestMode(testMode))
    
    if (shouldCallServer(getState())) {
      // Request a paper from the API and open the player
      return dispatch((dispatch) => {
        api
          .startAttempt(quiz.id)
          .then((normalizedData) =>
            dispatch(initPlayer(normalizedData.paper, normalizedData.answers)
          )
        )
      })
    } else {
      // Create a new local paper and open the player
      return dispatch(
        initPlayer(generatePaper(quiz, steps, previousPaper))
      )
    }
  }
}

actions.submit = (quizId, paperId, answers = null) => {
  return (dispatch, getState) => {
    let answersPromise
    if (answers && shouldCallServer(getState())) {
      // Send answers to the API
      answersPromise = api.submitAnswers(quizId, paperId, answers)
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
      if (shouldCallServer(getState())) {
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

    // Redirect to the quiz overview
    dispatch(quizActions.updateViewMode(VIEW_OVERVIEW))
  }
}
