export const utils = {
  answerIsValid(answer, solutions){
    const solution = solutions.find(solution => solution.itemId === answer.itemId)
    return undefined === solution.position ? false : solution.position === answer.position
  },
  showScore(answer, solutions) {
    return (utils.answerIsValid(answer, solutions) && solutions.find(solution => solution.itemId === answer.itemId).score > 0)
      || (!utils.answerIsValid(answer, solutions) && solutions.find(solution => solution.itemId === answer.itemId).score < 1)
  },
  checkAllAnswers(solutions, answer) {
    const correctAnswers = solutions.filter(solution => solution.score > 0 && undefined !== answer.find(a => a.itemId === solution.itemId && a.position === solution.position))
    const correctSolutions = solutions.filter(solution => solution.score > 0)
    return correctAnswers.length === correctSolutions.length
  }
}
