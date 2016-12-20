import merge from 'lodash/merge'

import {update} from './../../utils/utils'
import {makeReducer} from './../../utils/reducers'
import {decorateAnswer} from './decorators'

import {
  PAPER_SET,
  ANSWERS_SET,
  ANSWERS_INIT,
  ANSWER_ADD,
  ANSWER_UPDATE,
  CURRENT_STEP_CHANGE
} from './actions'

function setPaper(state, action) {
  return action.paper
}

function setAnswers(state, action) {
  return action.answers
}

function initAnswers(state, action) {
  const newAnswers = action.items.reduce((acc, item) => {
    if (!state[item.id]) {
      acc[item.id] = {$set: decorateAnswer({ _touched: true })}
    }

    return acc
  })

  return update(state, newAnswers)
}

function addAnswer(state, action) {
  const newAnswer = decorateAnswer({
    data: action.answerData,
    _touched: true
  })

  return update(state, {[action.questionId]: {$set: newAnswer}})
}

function updateAnswer(state, action) {
  const updatedAnswer = merge(
    state[action.questionId],
    {
      data: action.answerData,
      _touched: true
    }
  )

  return update(state, {[action.questionId]: {$set: updatedAnswer}})
}

function changeCurrentStep(state, action) {
  return action.id
}

export const reducers = {
  paper: makeReducer({}, {
    [PAPER_SET]: setPaper
  }),
  answers: makeReducer({}, {
    [ANSWERS_SET]: setAnswers,
    [ANSWERS_INIT]: initAnswers,
    [ANSWER_ADD]: addAnswer,
    [ANSWER_UPDATE]: updateAnswer
  }),
  currentStep: makeReducer(null, {
    [CURRENT_STEP_CHANGE]: changeCurrentStep
  })
}
