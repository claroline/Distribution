import {makeReducer} from './../../utils/reducers'

import {
  QUESTION_REQUEST,
  QUESTION_CREATE,
  QUESTION_UPDATE,
  QUESTION_DELETE
} from './../actions/questions'

function requestQuestions() {

}

function createQuestion() {

}

function updateQuestion() {

}

function deleteQuestion() {

}

const questionsReducer = makeReducer([], {
  [QUESTION_REQUEST]: requestQuestions,
  [QUESTION_CREATE]: createQuestion,
  [QUESTION_UPDATE]: updateQuestion,
  [QUESTION_DELETE]: deleteQuestion
})

export default questionsReducer