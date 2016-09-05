
export default class ScoreService {
  max(rule, solution) {
    let score = 0

    switch (rule.type) {
      case 'fixed':
        score = rule.success
        break

      case 'sum':
        for (let i = 0; i < solutionsFound.length; i++) {
          score += solutionsFound.score
        }

        break
    }

    return score
  }

  calculate(rule, valid, solutionsFound) {
    let score = 0

    switch (rule.type) {
      case 'fixed':
        score = valid ? rule.success : rule.failure

        break

      case 'sum':
        for (let i = 0; i < solutionsFound.length; i++) {
          score += solutionsFound.score
        }

        break
    }
  }
}
