import {createSelector} from 'reselect'

const correction = state => state.correction
const questions = createSelector(
  correction,
  (correction) => {
    let data = []
    correction['questions'].forEach(q => {
      data.push({
        question: q,
        answers: correction['answers'].filter(a => a.questionId === q.id)
      })
    })

    return data
  }
)
const answers = createSelector(
  correction,
  (correction) => {
    return correction['answers'].filter(a => a.questionId === correction['currentQuestionId'])
  }
)
const currentQuestion = createSelector(
  correction,
  (correction) => {
    return correction['questions'].find(question => question.id === correction['currentQuestionId'])
  }
)
const hasCorrection = createSelector(
  correction,
  (correction) => {
    let result = false
    correction['answers'].forEach(a => {
      if (a.questionId === correction['currentQuestionId'] && a.score !== undefined && a.score !== null && !isNaN(a.score)) {
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
