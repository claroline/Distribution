import {createSelector} from 'reselect'
import {TYPE_QUIZ, TYPE_STEP} from './../enums'

const quiz = state => state.quiz
const steps = state => state.steps
const items = state => state.items
const modal = state => state.modal
const editor = state => state.editor

const currentObject = createSelector(editor, editor => editor.currentObject)
const openPanels = createSelector(editor, editor => editor.openPanels)
const quizOpenPanel = createSelector(openPanels, panels => panels[TYPE_QUIZ])
const openStepPanels = createSelector(openPanels, panels => panels[TYPE_STEP])

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

    return Object.assign({}, steps[current.id], {
      type: TYPE_STEP,
      items: steps[current.id].items.map(itemId => items[itemId])
    })
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
  quiz,
  thumbnails,
  currentObjectDeep,
  quizOpenPanel,
  stepOpenPanel,
  modal,
  nextObject
}
