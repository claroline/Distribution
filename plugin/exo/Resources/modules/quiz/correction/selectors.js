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
        answers: answersList.filter(a => (a.questionId === q.id) && (a.score === undefined || a.score === null))
      })
    })

    return data
  }
)
const answers = createSelector(
  answersList,
  currentQuestionId,
  (answersList, currentQuestionId) => {
    return answersList.filter(a => (a.questionId === currentQuestionId) && (a.score === undefined || a.score === null))
  }
)
const currentQuestion = createSelector(
  questionsList,
  currentQuestionId,
  (questionsList, currentQuestionId) => {
    return questionsList.find(question => question.id === currentQuestionId)
  }
)

export const selectors = {
  questions,
  answers,
  currentQuestion
}
