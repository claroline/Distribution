import {makeReducer} from './../../utils/reducers'
import {update} from './../../utils/utils'

import {
  QUESTIONS_SET,
  QUESTIONS_REMOVE
} from './../actions/questions'

function setQuestions(state, action) {
  return action.questions
}

function removeQuestions(state, action) {
  let newState = state;
  action.questions.map((questionId, index) => {
    newState = update(newState, {$splice: [[index, 1]]})
  })

  return newState
}

const questionsReducer = makeReducer([], {
  [QUESTIONS_SET]: setQuestions,
  [QUESTIONS_REMOVE]: removeQuestions
})

export default questionsReducer
