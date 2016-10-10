import {getIndex, makeId, makeItemPanelKey, update} from './util'
import {properties, TYPE_QUIZ, TYPE_STEP} from './types'
import {
  ITEM_CREATE,
  ITEM_DELETE,
  ITEM_MOVE,
  MODAL_FADE,
  MODAL_HIDE,
  MODAL_SHOW,
  OBJECT_NEXT,
  OBJECT_SELECT,
  PANEL_QUIZ_SELECT,
  PANEL_STEP_SELECT,
  STEP_CREATE,
  STEP_MOVE,
  STEP_DELETE
} from './actions'

function initialQuizState() {
  return {
    id: makeId(),
    steps: []
  }
}

function reduceQuiz(quiz = initialQuizState(), action = {}) {
  switch (action.type) {
    case STEP_CREATE:
      return update(quiz, {steps: {$push: [action.id]}})
    case STEP_DELETE:
      return update(quiz, {steps: {$splice: [[getIndex(quiz.steps, action.id), 1]]}})
    case STEP_MOVE: {
      const index = getIndex(quiz.steps, action.id)
      const swapIndex = getIndex(quiz.steps, action.swapId)
      return update(quiz, {
        steps: {
          [index]: {$set: action.swapId},
          [swapIndex]: {$set: action.id}
        }
      })
    }
  }

  return quiz
}

function reduceSteps(steps = {}, action = {}) {
  switch (action.type) {
    case ITEM_CREATE:
      return update(steps, {[action.stepId]: {items: {$push: [action.id]}}})
    case ITEM_DELETE: {
      const index = getIndex(steps[action.stepId].items, action.id)
      return update(steps, {[action.stepId]: {items: {$splice: [[index, 1]]}}})
    }
    case ITEM_MOVE: {
      const index = getIndex(steps[action.stepId].items, action.id)
      const swapIndex = getIndex(steps[action.stepId].items, action.swapId)
      return update(steps, {
        [action.stepId]: {
          items: {
            [index]: {$set: action.swapId},
            [swapIndex]: {$set: action.id}
          }
        }
      })
    }
    case STEP_CREATE: {
      const newStep = {id: action.id, items: [], meta: {}}
      return update(steps, {[action.id]: {$set: newStep}})
    }
    case STEP_DELETE:
      return update(steps, {$delete: action.id})
  }
  return steps
}

function reduceItems(items = {}, action = {}) {
  switch (action.type) {
    case ITEM_CREATE: {
      let newItem = {
        id: action.id,
        type: action.itemType,
        score: {
          type: 'sum'
        }
      }
      switch (action.itemType) {
        case 'application/x.choice+json':
          newItem = properties[action.itemType].reducer(newItem, action)
          break
        case 'application/x.open+json':
          newItem = properties[action.itemType].reducer(newItem, action)
          break
      }
      return update(items, {[action.id]: {$set: newItem}})
    }
    case ITEM_DELETE:
      return update(items, {$delete: action.id})
  }
  return items
}

function reduceCurrentObject(object = {}, action = {}) {
  switch (action.type) {
    case OBJECT_SELECT:
      return {
        id: action.id,
        type: action.objectType
      }
    case STEP_CREATE:
      return {
        id: action.id,
        type: TYPE_STEP
      }
    case OBJECT_NEXT:
      return {
        id: action.object.id,
        type: action.object.type
      }
  }
  return object
}

function initialPanelState() {
  return {
    [TYPE_QUIZ]: false,
    [TYPE_STEP]: {}
  }
}

function reduceOpenPanels(panels = initialPanelState(), action = {}) {
  switch (action.type) {
    case PANEL_QUIZ_SELECT: {
      const value = panels[TYPE_QUIZ] === action.panelKey ? false : action.panelKey
      return update(panels, {[TYPE_QUIZ]: {$set: value}})
    }
    case PANEL_STEP_SELECT: {
      const value = panels[TYPE_STEP][action.stepId] === action.panelKey ? false : action.panelKey
      return update(panels, {[TYPE_STEP]: {[action.stepId]: {$set: value}}})
    }
    case ITEM_CREATE: {
      const panelKey = makeItemPanelKey(action.itemType, action.id)
      return update(panels, {[TYPE_STEP]: {[action.stepId]: {$set: panelKey}}})
    }
  }
  return panels
}

const initialModalState = {
  type: null,
  props: {},
  fading: false
}

function reduceModal(modalState = initialModalState, action) {
  switch (action.type) {
    case MODAL_SHOW:
      return {
        type: action.modalType,
        props: action.modalProps,
        fading: false
      }
    case MODAL_FADE:
      return update(modalState, {fading: {$set: true}})
    case MODAL_HIDE:
      return initialModalState
  }
  return modalState
}

export const reducers = {
  quiz: reduceQuiz,
  steps: reduceSteps,
  items: reduceItems,
  currentObject: reduceCurrentObject,
  openPanels: reduceOpenPanels,
  modal: reduceModal
}
