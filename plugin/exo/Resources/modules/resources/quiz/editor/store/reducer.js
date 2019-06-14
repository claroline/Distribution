import cloneDeep from 'lodash/cloneDeep'
import isEmpty from 'lodash/isEmpty'
import merge from 'lodash/merge'

import {makeReducer} from '#/main/app/store/reducer'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {makeId} from '#/main/core/scaffolding/id'
import {RESOURCE_LOAD} from '#/main/core/resource/store/actions'

import {Quiz, Step} from '#/plugin/exo/resources/quiz/prop-types'
import {
  QUIZ_STEP_ADD,
  QUIZ_STEP_COPY,
  QUIZ_STEP_MOVE,
  QUIZ_STEP_REMOVE,
  QUIZ_ITEM_MOVE,
  QUIZ_ITEM_COPY
} from '#/plugin/exo/resources/quiz/editor/store/actions'

function setDefaults(quiz) {
  // adds default value to quiz data
  const formData = merge({}, Quiz.defaultProps, quiz)

  if (isEmpty(formData.steps)) {
    // adds an empty step
    formData.steps.push(createStep())
  }

  return formData
}

function createStep(stepData = {}) {
  return merge({id: makeId()}, Step.defaultProps, stepData)
}

function pushStep(step, steps, position) {
  const newSteps = cloneDeep(steps)

  switch (position.order) {
    case 'first':
      newSteps.unshift(step)
      break

    case 'before':
    case 'after':
      if ('before' === position.order) {
        newSteps.splice(steps.findIndex(step => step.id === position.step), 0, step)
      } else {
        newSteps.splice(steps.findIndex(step => step.id === position.step) + 1, 0, step)
      }
      break

    case 'last':
      newSteps.push(step)
      break
  }

  return newSteps
}

function pushItem(item, items, position) {
  const newItems = cloneDeep(items)

  switch (position.order) {
    case 'first':
      newItems.unshift(item)
      break

    case 'before':
    case 'after':
      if ('before' === position.order) {
        newItems.splice(items.findIndex(item => item.id === position.item), 0, item)
      } else {
        newItems.splice(items.findIndex(item => item.id === position.item) + 1, 0, item)
      }
      break

    case 'last':
      newItems.push(item)
      break
  }

  return newItems
}

export const reducer = makeFormReducer('resource.editor', {}, {
  pendingChanges: makeReducer(false, {
    [QUIZ_STEP_ADD]: () => true,
    [QUIZ_STEP_COPY]: () => true,
    [QUIZ_STEP_MOVE]: () => true,
    [QUIZ_STEP_REMOVE]: () => true,
    [QUIZ_ITEM_MOVE]: () => true,
    [QUIZ_ITEM_COPY]: () => true
  }),
  originalData: makeReducer({}, {
    [RESOURCE_LOAD]: (state, action) => setDefaults(action.resourceData.quiz) || state
  }),
  data: makeReducer({}, {
    /**
     * Fills form when the quiz data are loaded.
     *
     * @param {object} state - the quiz object @see Quiz.propTypes
     */
    [RESOURCE_LOAD]: (state, action) => setDefaults(action.resourceData.quiz) || state,

    /**
     * Adds a new step to the quiz.
     *
     * @param {object} state - the quiz object @see Quiz.propTypes
     */
    [QUIZ_STEP_ADD]: (state, action) => {
      const newState = cloneDeep(state)

      const newStep = createStep(action.step)
      newState.steps.push(newStep)

      return newState
    },

    [QUIZ_ITEM_COPY]: (state, action) => {
      const newState = cloneDeep(state)

      const newParent = newState.steps.find(step => step.id === action.position.parent)
      const newItems = newParent.items

      newParent.items = pushItem(action.item, newItems, action.position)

      return newState
    },

    [QUIZ_ITEM_MOVE]: (state, action) => {
      const newState = cloneDeep(state)
      const oldStep = newState.steps.find(step => step.items.find(item => item.id === action.id))
      const currentPos = oldStep.items.findIndex(item => item.id === action.id)
      const newParent = newState.steps.find(step => step.id === action.position.parent)
      const newItems = newParent.items

      if (-1 !== currentPos) {
        const currentItem = oldStep.items.splice(currentPos, 1)

        newParent.items = pushItem(currentItem[0], newItems, action.position)
      }

      return newState
    },

    /**
     * Creates a copy af a copy and push it at the requested position.
     *
     * @param {object} state - the quiz object @see Quiz.propTypes
     */
    [QUIZ_STEP_COPY]: (state, action) => {
      const newState = cloneDeep(state)

      const original = newState.steps.find(step => step.id === action.id)
      if (original) {
        // create a copy of the step
        const copy = cloneDeep(original)
        copy.id = makeId()

        // TODO : replace items ids

        // push created step in the list
        newState.steps = pushStep(copy, newState.steps, action.position)
      }

      return newState
    },

    /**
     * Moves a step to another position.
     *
     * @param {object} state - the quiz object @see Quiz.propTypes
     */
    [QUIZ_STEP_MOVE]: (state, action) => {
      const newState = cloneDeep(state)

      const currentPos = newState.steps.findIndex(step => step.id === action.id)
      if (-1 !== currentPos) {
        const currentStep = newState.steps.splice(currentPos, 1)

        newState.steps = pushStep(currentStep[0], newState.steps, action.position)
      }

      return newState
    },

    /**
     * Removes a step from the quiz.
     *
     * @param {object} state - the quiz object @see Quiz.propTypes
     */
    [QUIZ_STEP_REMOVE]: (state, action) => {
      const newState = cloneDeep(state)

      const stepPosition = newState.steps.findIndex(step => step.id === action.id)
      if (-1 !== stepPosition) {
        newState.steps.splice(stepPosition, 1)
      }

      return newState
    }
  })
})
