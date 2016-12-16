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
      parameters: rawQuiz.parameters,
      steps: rawQuiz.steps.map(step => step.id)
    },
    steps,
    items
  }
}

// unflattens flat quiz data
export function denormalize(flatQuiz) {
  // build items
  // build steps with items
  let steps = []
  flatQuiz.steps.forEach(stepId => {
    let step = {
      id: stepId,
      items: [] // flatQuiz onnly qives me step id
    }
    steps.push(step)
  })
  return {
    id: flatQuiz.id,
    title: flatQuiz.title,
    meta: flatQuiz.meta,
    parameters: flatQuiz.parameters,
    steps: [
      {
        id: '1',
        items: [
          {
            id: '3532D05C-CAE9-4ED2-9A55-6D7216C166EE',
            content: 'Question ?',
            type: 'application/x.choice+json',
            score: {
              type: 'sum'
            },
            choices: [
              {
                id: '1',
                type: 'text/html',
                data: 'test changement'
              },
              {
                id: '2',
                type: 'text/html',
                data: 'http://domain.com/image-2.png'
              },
              {
                id: '3',
                type: 'text/html',
                data: 'http://domain.com/image-3.png'
              }
            ],
            random: true,
            multiple: true,
            solutions: [
              {
                id: '1',
                score: 2
              },
              {
                id: '2',
                score: 1
              },
              {
                id: '3',
                score: 1
              }
            ]
          },
          {
            id: '864FF1A6-68E3-411C-9C76-B341DE79ADCA',
            content: 'Question ?',
            type: 'application/x.open+json',
            score: {
              type: 'fixed',
              success: 10,
              failure: 0
            },
            contentType: 'text',
            solutions: []
          }
        ]
      }
    ]
  }

}
