import {notBlank, number, gteZero, chain, setIfError} from './lib/validate'
import {getDefinition} from './item-types'

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

function validateItem(item) {
  const errors = validateBaseItem(item)
  const subErrors = getDefinition(item.type).validate(item)

  return Object.assign(errors, subErrors)
}

function validateBaseItem(item) {
  const errors = {}

  setIfError(errors, 'content', notBlank(item.content, true))

  return errors
}

export default {
  quiz: validateQuiz,
  step: validateStep,
  item: validateItem
}
