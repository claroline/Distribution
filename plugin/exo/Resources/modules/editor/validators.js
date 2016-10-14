import {notBlank, number, gteZero, chain} from './lib/validate'

function validateQuiz(quiz) {
  const parameters = quiz.parameters

  return {
    title: notBlank(quiz.title),
    parameters: {
      pick: chain(parameters.pick, [notBlank, number, gteZero]),
      duration: chain(parameters.duration, [notBlank, number, gteZero]),
      maxAttempts: chain(parameters.maxAttempts, [notBlank, number, gteZero])
    }
  }
}

function validateStep(step) {
  return {
    parameters: {
      maxAttempts: chain(step.parameters.maxAttempts, [notBlank, number, gteZero])
    }
  }
}

export default {
  quiz: validateQuiz,
  step: validateStep
}
