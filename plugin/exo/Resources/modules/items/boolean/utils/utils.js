export const utils = {
  getAnswerClass(solution, answer){
    if(!answer || !answer.id){
      return 'bg-choice'
    } else if (solution.score > 0) {
      return answer.id === solution.id ? 'text-success bg-success' : 'bg-choice'
    } else if (solution.score < 1) {
      return answer.id === solution.id ? 'text-danger bg-danger' : 'bg-choice'
    }
  }
}
