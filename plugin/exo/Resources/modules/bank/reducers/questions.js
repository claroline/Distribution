import {makeReducer} from './../../utils/reducers'

import {
  QUESTIONS_SET
} from './../actions/questions'

function setQuestions(state, action) {
  return action.questions
}

const questionsReducer = makeReducer([], {
  [QUESTIONS_SET]: setQuestions
})

export default questionsReducer
