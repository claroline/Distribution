export const utils = {}

utils.getSolutionItemData = (searched, list) => {
  const item = list.find(el => el.id === searched )

  return item.data || ''
}

/**
 * @var associations answers or solutions
 */
utils.getSetItems = (setId, associations) => {
  return associations.filter(ass => ass.setId === setId) || []
}

utils.isValidAnswer = (answer, solutions) => {
  const solution = solutions.find(solution => solution.itemId === answer.itemId && solution.setId === answer.setId)
  return undefined !== solution && solution.score > 0
}

utils.answerInSolutions = (answer, solutions) => {
  return undefined !== solutions.find(solution => solution.itemId === answer.itemId && solution.setId === answer.setId)
}

utils.getAnswerSolution = (answer, solutions) => {
  return solutions.find(solution => solution.itemId === answer.itemId && solution.setId === answer.setId)
}

utils.getAnswerSolutionFeedback = (answer, solutions) => {
  const solution = utils.getAnswerSolution(answer, solutions)
  return undefined !== solution ? solution.feedback : ''
}

utils.getAnswerSolutionScore = (answer, solutions) => {
  const solution = utils.getAnswerSolution(answer, solutions)
  return undefined !== solution ? solution.score : ''
}
