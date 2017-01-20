import {createSelector} from 'reselect'

const currentQuestionId = state => state.currentQuestion
const questionsList = state => state.questions
const answersList = state => state.openAnswers
const questions = createSelector(
  questionsList,
  answersList,
  (questionsList, answersList) => {
    let data = []
    questionsList.forEach(q => {
      data.push({
        question: q,
        answers: answersList.filter(a => a.questionId === q.id)
      })
    })

    return data
  }
)
const answers = createSelector(
  answersList,
  currentQuestionId,
  (answersList, currentQuestionId) => {
    return answersList.filter(a => a.questionId === currentQuestionId)
  }
)
const currentQuestion = createSelector(
  questionsList,
  currentQuestionId,
  (questionsList, currentQuestionId) => {
    return questionsList.find(question => question.id === currentQuestionId)
  }
)
const hasCorrection = createSelector(
  answersList,
  currentQuestionId,
  (answersList, currentQuestionId) => {
    let result = false
    answersList.forEach(a => {
      if (a.questionId === currentQuestionId && a.score !== undefined && a.score !== null && !isNaN(a.score)) {
        result = true
      }
    })
    return result
  }
)

export const selectors = {
  questions,
  answers,
  currentQuestion,
  hasCorrection
}
