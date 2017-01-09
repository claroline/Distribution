import {createSelector} from 'reselect'

const offline = (state) => state.noServer || state.testMode
const paper = (state) => state.paper
const currentStepId = (state) => state.currentStep
const answers = (state) => state.answers

const steps = createSelector(
  paper,
  (paper) => paper.structure.steps
)

/**
 * Gets the definition of the step that is currently played.
 */
const currentStep = createSelector(
  steps,
  currentStepId,
  (steps, currentStepId) => steps.find(step => step.id === currentStepId)
)

/**
 * Retrieves the picked items for a step.
 */
const currentStepItems = createSelector(
  currentStep,
  (currentStep) => currentStep.items
)

const currentStepOrder = createSelector(
  steps,
  currentStep,
  (steps, currentStep) => steps.indexOf(currentStep)
)

const currentStepNumber = createSelector(
  currentStepOrder,
  (currentStepOrder) => currentStepOrder + 1
)

/**
 * Gets an existing answer to a question.
 */
const currentStepAnswers = createSelector(
  currentStepItems,
  answers,
  (currentStepItems, answers) => {
    return currentStepItems.reduce((answerAcc, item) => {
      answerAcc[item.id] = Object.assign({}, answers[item.id])

      return answerAcc
    }, {})
  }
)

/**
 * Retrieves the next step to play (based on the paper structure).
 */
const previous = createSelector(
  steps,
  currentStepOrder,
  (steps, currentStepOrder) => currentStepOrder - 1 >= 0 ? steps[currentStepOrder - 1] : null
)

/**
 * Retrieves the previous played step (based on the paper structure).
 */
const next = createSelector(
  steps,
  currentStepOrder,
  (steps, currentStepOrder) => currentStepOrder + 1 < steps.length ? steps[currentStepOrder + 1] : null
)

export const select = {
  offline,
  paper,
  steps,
  answers,
  currentStepId,
  currentStep,
  currentStepOrder,
  currentStepNumber,
  currentStepItems,
  currentStepAnswers,
  previous,
  next
}
