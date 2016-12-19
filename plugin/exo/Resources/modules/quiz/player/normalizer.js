// flattens raw attempt data
export function normalize(rawAttempt) {
  let answers = []

  if (rawAttempt.paper.answers) {
    answers = rawAttempt.paper.answers.reduce((answerAcc, answer) => {
      answerAcc[answer.questionId] = Object.assign({}, answer)

      return answerAcc
    }, {})
  }

  const paper = Object.assign({}, rawAttempt.paper)
  paper.answers = paper.answers ? paper.answers.map(answer => answer.questionId) : []

  const items = rawAttempt.items.reduce((itemAcc, item) => {
    itemAcc[item.id] = Object.assign({}, item)

    return itemAcc
  }, {})

  return {
    paper,
    answers,
    items
  }
}
