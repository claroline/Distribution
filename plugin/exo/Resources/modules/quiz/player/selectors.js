export const select = {}

// TODO : use reselect to compose selectors

/**
 * Gets the definition of the step that is currently played.
 *
 * @param {object} state
 *
 * @return {object}
 */
select.currentStep = state => state.steps[state.currentStep.id]

select.paper = state => state.paper

select.offline = state => state.noServer || state.testMode

select.showFeedback = state => state.quiz.parameters.showFeedback

select.feedbackEnabled = state => state.currentStep.feedbackEnabled

select.quizMaxAttempts = state => state.quiz.parameters.maxAttempts

/**
 * Gets an existing answer to a question.
 *
 * @param {object} state
 */
select.currentStepAnswers = (state) => {
  const items = select.currentStepItems(state)

  return items.reduce((answerAcc, item) => {
    answerAcc[item.id] = Object.assign({}, state.answers[item.id])

    return answerAcc
  }, {})
}

/**
 * Retrieves the picked items for a step.
 *
 * @param {object} state
 *
 * @returns {array}
 */
select.currentStepItems = (state) => {
  const stepStructure = state.paper.structure.find((step) => step.id === state.currentStep.id)

  return stepStructure.items.map(itemId => state.items[itemId])
}

select.currentStepNumber = (state) => {
  const currentStep = state.paper.structure.find((step) => step.id === state.currentStep.id)

  return state.paper.structure.indexOf(currentStep) + 1
}

select.currentStepTries = (state) => {
  let currentTries = 0

  Object.keys(state.answers).forEach((questionId) => {
    if (state.answers[questionId].tries > currentTries && select.currentStep(state).items.indexOf(questionId) > -1) {
      currentTries = state.answers[questionId].tries
    }
  })

  return currentTries
}

select.currentStepSend = (state) => {
  const tries = select.currentStepTries(state)
  const max = select.quizMaxAttempts(state)

  if (max === 0) return true

  return tries < max
}

/**
 * Retrieves the next step to play (based on the paper structure).
 *
 * @param state
 */
select.previous = (state) => {
  let previous = null

  const currentStep = state.paper.structure.find((step) => step.id === state.currentStep.id)
  const order = state.paper.structure.indexOf(currentStep)
  if (0 <= order - 1 && state.paper.structure[order - 1]) {
    previous = state.paper.structure[order - 1]
  }

  return previous
}

/**
 * Retrieves the previous played step (based on the paper structure).
 *
 * @param state
 */
select.next = (state) => {
  let next = null

  const currentStep = state.paper.structure.find((step) => step.id === state.currentStep.id)
  const order = state.paper.structure.indexOf(currentStep)
  if (state.paper.structure.length > order + 1 && state.paper.structure[order + 1]) {
    next = state.paper.structure[order + 1]
  }

  return next
}
