export const utils = {}

utils.getChoiceById = (choices, choiceId) => {
  return choices.find(choice => choice.id === choiceId)
}

utils.isSolutionChecked = (solution, answers) => {
  return answers ? answers.indexOf(solution.id) > -1 : false
}

utils.answerId = (id) => {
  return `${id}-your-answer`
}

utils.expectedId = (id) => {
  return `${id}-expected-answer`
}

utils.getAnswerClassForSolution = (solution, answers) => {
  return utils.isSolutionChecked(solution, answers) ?
    solution.score > 0 ? 'correct-answer' : 'incorrect-answer' : ''
}

utils.getStats = (choice, papers) => {
  const stats = {
    value: 0,
    total: 0
  }
  console.log(choice)
  console.log(papers)

  return stats
}