// flattens raw paper data
export function normalize(rawPaper) {
  let answers = {}

  if (rawPaper.answers && 0 !== rawPaper.answers.length) {
    answers = rawPaper.answers.reduce((answerAcc, answer) => {
      answerAcc[answer.questionId] = Object.assign({}, answer)

      return answerAcc
    }, {})
  }

  const paper = Object.assign({}, rawPaper)
  paper.answers = paper.answers ? paper.answers.map(answer => answer.questionId) : []

  return {
    paper,
    answers
  }
}
