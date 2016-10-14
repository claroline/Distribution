function sanitizeQuiz(quiz) {
  if (quiz.parameters) {
    const parameters = quiz.parameters

    if (parameters.pick) {
      parameters.pick = parseInt(parameters.pick)
    }
    if (parameters.duration) {
      parameters.duration = parseInt(parameters.duration)
    }
    if (parameters.maxAttempts) {
      parameters.maxAttempts = parseInt(parameters.maxAttempts)
    }
  }
  return quiz
}

function sanitizeStep(step) {
  if (step.parameters) {
    if (step.parameters.maxAttempts) {
      step.parameters.maxAttempts = parseInt(step.parameters.maxAttempts)
    }
  }
  return step
}

export default {
  quiz: sanitizeQuiz,
  step: sanitizeStep
}
