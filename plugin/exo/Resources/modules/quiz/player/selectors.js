export const select = {}

select.currentStep = (state) => state.steps[state.currentStep.id]

select.currentStepItems = (state) => {
  const stepStructure = state.paper.structure.find((step) => step.id === state.currentStep.id)

  return stepStructure.items.map((itemId) => state.items[itemId])
}
