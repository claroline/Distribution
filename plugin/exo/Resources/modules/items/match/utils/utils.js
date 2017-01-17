export const utils = {}

utils.isSolutionDrawn = (solution, answers) => {
  return answers ?
  answers.findIndex(answer => answer.firstId === solution.firstId && answer.secondId === solution.secondId) > -1 : false
}

utils.getAnswerClassForSolution = (solution, answers) => {
  return utils.isSolutionDrawn(solution, answers) ?
    solution.score > 0 ? 'bg-info text-info' : 'bg-danger text-danger' : ''
}


/**
 * @var id solution id
 * @var set first or second set
 *
 */
utils.getSolutionData = (id, set) => {
  return set.find(item => item.id === id).data
}
