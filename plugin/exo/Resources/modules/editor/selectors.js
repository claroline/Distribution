import {createSelector} from 'reselect'
import {TYPE_QUIZ, TYPE_STEP} from './types'

const quiz = state => state.quiz
const steps = state => state.steps
const items = state => state.items
const currentObject = state => state.currentObject
const quizProperties = state => state.quiz.meta
const quizOpenPanel = state => state.openPanels[TYPE_QUIZ]
const openStepPanels = state => state.openPanels[TYPE_STEP]
const modal = state => state.modal

const stepList = createSelector(
  quiz,
  steps,
  (quiz, steps) => quiz.steps.map(id => steps[id])
)

const quizThumbnail = createSelector(
  quiz,
  currentObject,
  (quiz, current) => {
    return {
      id: quiz.id,
      title: 'Exercice',
      type: TYPE_QUIZ,
      active: quiz.id === current.id && current.type === TYPE_QUIZ
    }
  }
)

const stepThumbnails = createSelector(
  stepList,
  currentObject,
  (steps, current) => steps.map((step, index) => {
    return {
      id: step.id,
      title: `Étape ${index + 1}`,
      type: TYPE_STEP,
      active: step.id === current.id && current.type === TYPE_STEP
    }
  })
)

const thumbnails = createSelector(
  quizThumbnail,
  stepThumbnails,
  (quiz, steps) => [quiz].concat(steps)
)

const currentObjectDeep = createSelector(
  currentObject,
  quiz,
  steps,
  items,
  (current, quiz, steps, items) => {
    if (current.type === TYPE_QUIZ) {
      return {
        type: TYPE_QUIZ,
        id: quiz.id
      }
    }

    const step = steps[current.id]

    return {
      type: TYPE_STEP,
      id: step.id,
      items: step.items.map(itemId => items[itemId]),
      meta: step.meta
    }
  }
)

const stepOpenPanel = createSelector(
  currentObject,
  openStepPanels,
  (current, panels) => {
    if (current.type === TYPE_STEP && panels[current.id] !== undefined) {
      return panels[current.id]
    }
    return false
  }
)

const nextObject = createSelector(
  currentObject,
  quiz,
  stepList,
  (current, quiz, steps) => {
    if (current.type === TYPE_QUIZ) {
      return current
    }

    if (steps.length <= 1) {
      return {
        id: quiz.id,
        type: TYPE_QUIZ
      }
    }

    const stepIndex = steps.findIndex(step => step.id === current.id)
    const nextIndex = stepIndex === 0 ? (stepIndex + 1) : (stepIndex - 1)

    return {
      id: steps[nextIndex].id,
      type: TYPE_STEP
    }
  }
)

export default {
  quizProperties,
  thumbnails,
  currentObjectDeep,
  quizOpenPanel,
  stepOpenPanel,
  modal,
  nextObject
}
