// flattens raw quiz data
export function normalize(rawQuiz) {
  let items = {}

  const steps = rawQuiz.steps.reduce((stepAcc, step) => {
    items = step.items.reduce((itemAcc, item) => {
      itemAcc[item.id] = item

      return itemAcc
    }, items)

    stepAcc[step.id] = Object.assign({}, step)
    stepAcc[step.id].items = step.items.map(item => item.id)

    return stepAcc
  }, {})

  return {
    quiz: {
      id: rawQuiz.id,
      title: rawQuiz.title,
      description: rawQuiz.description,
      meta: rawQuiz.meta,
      parameters: rawQuiz.parameters,
      steps: rawQuiz.steps.map(step => step.id)
    },
    steps,
    items
  }
}
