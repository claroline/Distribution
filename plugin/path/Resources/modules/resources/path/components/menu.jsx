// player
function getStepSummary(step) {
  return {
    type: LINK_BUTTON,
    icon: classes('step-progression fa fa-circle', step.userProgression && step.userProgression.status),
    label: step.title,
    target: `/play/${step.id}`,
    children: step.children ? step.children.map(getStepSummary) : []
  }
}

// editor
function getStepSummary(step) {
  return {
    type: LINK_BUTTON,
    icon: classes('step-progression fa fa-circle', step.userProgression && step.userProgression.status),
    label: step.title,
    target: `/edit/${step.id}`,
    additional: this.getStepActions(step),
    children: step.children ? step.children.map(this.getStepSummary) : []
  }
}
