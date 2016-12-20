export const select = {}

/**
 * Gets the definition of the step that is currently played.
 *
 * @param {object} state
 *
 * @return {object}
 */
select.currentStep = (state) => state.steps[state.currentStep]

/**
 * Retrieves the picked items for a step.
 *
 * @param {object} state
 *
 * @returns {array}
 */
select.currentStepItems = (state) => {
  const stepStructure = state.paper.structure.find((step) => step.id === state.currentStep)

  return stepStructure.items.map((itemId) => state.items[itemId])
}

/**
 * Retrieves the next step to play (based on the paper structure).
 *
 * @param state
 */
select.previousStep = (state) => {
  let previous = null

  const currentStep = state.paper.structure.find((step) => step.id === state.currentStep)
  const order = state.paper.structure.indexOf(currentStep)
  if (0 <= order - 1 && state.paper.structure[order - 1]) {
    previous = state.paper.structure[order - 1].id
  }

  return previous
}

select.currentStepNumber = (state) => {
  const currentStep = state.paper.structure.find((step) => step.id === state.currentStep)

  return state.paper.structure.indexOf(currentStep) + 1
}

/**
 * Retrieves the previous played step (based on the paper structure).
 *
 * @param state
 */
select.nextStep = (state) => {
  let next = null

  const currentStep = state.paper.structure.find((step) => step.id === state.currentStep)
  const order = state.paper.structure.indexOf(currentStep)
  if (state.paper.structure.length > order + 1 && state.paper.structure[order + 1]) {
    next = state.paper.structure[order + 1].id
  }

  return next
}
