export const utils = {}

utils.getAssociationByIds = (associations, firstId, secondId) => {
  return associations.find(association => association.firstId === firstId && association.secondId === secondId)
}

utils.isSolutionDrawn = (solution, answers) => {
  return answers ?
  answers.findIndex(answer => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 : false
}

utils.answerId = (id) => {
  return `${id}-your-answer`
}

utils.expectedId = (id) => {
  return `${id}-expected-answer`
}

utils.getAnswerClassForSolution = (solution, answers) => {
  return utils.isSolutionDrawn(solution, answers) ?
    solution.score > 0 ? 'bg-success text-success' : 'bg-danger text-danger' : ''
}
