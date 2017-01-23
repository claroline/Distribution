import {CORRECTION_INIT, QUESTION_CURRENT, SCORE_UPDATE, FEEDBACK_UPDATE, REMOVE_ANSWERS} from './actions'

export const reduceCorrection = (state = {}, action = {}) => {
  switch (action.type) {
    case CORRECTION_INIT:
      return Object.assign({}, state, {
        questions: action.correction.questions,
        answers: action.correction.answers,
        currentQuestionId: null
      })
    case QUESTION_CURRENT:
      return Object.assign({}, state, {
        currentQuestionId: action.id
      })
    case SCORE_UPDATE:
      const scoreAnswers = state['answers'].map((answer) => {
        if (answer.id === action.answerId) {
          return Object.assign({}, answer, {score: parseFloat(action.score)})
        } else {
          return answer
        }
      })
      return Object.assign({}, state, {
        answers: scoreAnswers
      })
    case FEEDBACK_UPDATE:
      const feedbackAnswers = state['answers'].map((answer) => {
        if (answer.id === action.answerId) {
          return Object.assign({}, answer, {feedback: action.feedback})
        } else {
          return answer
        }
      })
      return Object.assign({}, state, {
        answers: feedbackAnswers
      })
    case REMOVE_ANSWERS:
      return Object.assign({}, state, {
        answers: state['answers'].filter(answer => action.ids.indexOf(answer.id) === -1)
      })
  }

  return state
}