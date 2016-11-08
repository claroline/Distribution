import {makeReducer} from './../../utils/reducers'

import {
  CURRENT_QUESTION_SET,
  CURRENT_QUESTION_UNSET
} from './../actions/current-question'

function setCurrentQuestion(currentQuestionState, action = {}) {
  return action.questionId
}

function unsetCurrentQuestion() {
  return null
}

const currentQuestionReducer = makeReducer(null, {
  [CURRENT_QUESTION_SET]: setCurrentQuestion,
  [CURRENT_QUESTION_UNSET]: unsetCurrentQuestion
})

export default currentQuestionReducer