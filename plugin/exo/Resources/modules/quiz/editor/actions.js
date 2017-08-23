import invariant from 'invariant'
import select from './selectors'
import {makeActionCreator} from '#/main/core/utilities/redux'
import {makeId} from './../../utils/utils'
import {REQUEST_SEND} from './../../api/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'
import {tex} from '#/main/core/translation'
import {MODAL_MESSAGE} from '#/main/core/layout/modal'
import {denormalize} from './../normalizer'
import forOwn from 'lodash/forOwn'

export const ITEM_CREATE = 'ITEM_CREATE'
export const ITEM_UPDATE = 'ITEM_UPDATE'
export const ITEM_DELETE = 'ITEM_DELETE'
export const ITEM_MOVE = 'ITEM_MOVE'
export const ITEM_HINTS_UPDATE = 'ITEM_HINTS_UPDATE'
export const ITEM_DETAIL_UPDATE = 'ITEM_DETAIL_UPDATE'
export const ITEMS_IMPORT = 'ITEMS_IMPORT'
export const OBJECT_NEXT = 'OBJECT_NEXT'
export const OBJECT_SELECT = 'OBJECT_SELECT'
export const PANEL_QUIZ_SELECT = 'PANEL_QUIZ_SELECT'
export const PANEL_STEP_SELECT = 'PANEL_STEP_SELECT'
export const STEP_CREATE = 'STEP_CREATE'
export const STEP_DELETE = 'STEP_DELETE'
export const STEP_UPDATE = 'STEP_UPDATE'
export const STEP_MOVE = 'STEP_MOVE'
export const STEP_ITEM_DELETE = 'STEP_ITEM_DELETE'
export const QUIZ_UPDATE = 'QUIZ_UPDATE'
export const HINT_ADD = 'HINT_ADD'
export const HINT_CHANGE = 'HINT_CHANGE'
export const HINT_REMOVE = 'HINT_REMOVE'
export const QUIZ_SAVING = 'QUIZ_SAVING'
export const QUIZ_VALIDATING = 'QUIZ_VALIDATING'
export const QUIZ_SAVED = 'QUIZ_SAVED'
export const QUIZ_SAVE_ERROR = 'QUIZ_SAVE_ERROR'
export const CONTENT_ITEM_CREATE = 'CONTENT_ITEM_CREATE'
export const CONTENT_ITEM_UPDATE = 'CONTENT_ITEM_UPDATE'
export const CONTENT_ITEM_DETAIL_UPDATE = 'CONTENT_ITEM_DETAIL_UPDATE'
export const ITEM_OBJECTS_UPDATE = 'ITEM_OBJECTS_UPDATE'
export const OBJECT_ADD = 'OBJECT_ADD'
export const OBJECT_CHANGE = 'OBJECT_CHANGE'
export const OBJECT_REMOVE = 'OBJECT_REMOVE'
export const OBJECT_MOVE = 'OBJECT_MOVE'
export const QUESTION_MOVE = 'QUESTION_MOVE'

// the following action types lead to quiz data changes that need to be
// properly saved (please maintain this list up-to-date)
export const quizChangeActions = [
  ITEM_CREATE,
  ITEM_DELETE,
  ITEM_UPDATE,
  ITEM_MOVE,
  ITEM_HINTS_UPDATE,
  ITEM_DETAIL_UPDATE,
  ITEMS_IMPORT,
  STEP_CREATE,
  STEP_MOVE,
  STEP_DELETE,
  STEP_UPDATE,
  STEP_ITEM_DELETE,
  QUIZ_UPDATE,
  HINT_ADD,
  HINT_CHANGE,
  HINT_REMOVE,
  CONTENT_ITEM_CREATE,
  CONTENT_ITEM_UPDATE,
  CONTENT_ITEM_DETAIL_UPDATE,
  ITEM_OBJECTS_UPDATE,
  OBJECT_ADD,
  OBJECT_CHANGE,
  OBJECT_REMOVE,
  OBJECT_MOVE,
  QUESTION_MOVE
]

export const actions = {}

actions.deleteStep = makeActionCreator(STEP_DELETE, 'id')
actions.deleteItem = makeActionCreator(ITEM_DELETE, 'id')
actions.moveItem = makeActionCreator(ITEM_MOVE, 'id', 'swapId', 'stepId')
actions.moveStep = makeActionCreator(STEP_MOVE, 'id', 'swapId')
actions.nextObject = makeActionCreator(OBJECT_NEXT, 'object')
actions.selectObject = makeActionCreator(OBJECT_SELECT, 'id', 'objectType')
actions.selectQuizPanel = makeActionCreator(PANEL_QUIZ_SELECT, 'panelKey')
actions.selectStepPanel = makeActionCreator(PANEL_STEP_SELECT, 'stepId', 'panelKey')
actions.updateQuiz = makeActionCreator(QUIZ_UPDATE, 'propertyPath', 'value')
actions.updateItem = makeActionCreator(ITEM_UPDATE, 'id', 'propertyPath', 'value')
actions.updateItemDetail = makeActionCreator(ITEM_DETAIL_UPDATE, 'id', 'subAction')
actions.updateItemHints = makeActionCreator(ITEM_HINTS_UPDATE, 'itemId', 'updateType', 'payload')
actions.updateStep = makeActionCreator(STEP_UPDATE, 'id', 'newProperties')
actions.importItems = makeActionCreator(ITEMS_IMPORT, 'stepId', 'items')
actions.quizValidating = makeActionCreator(QUIZ_VALIDATING)
actions.quizSaving = makeActionCreator(QUIZ_SAVING)
actions.quizSaved = makeActionCreator(QUIZ_SAVED)
actions.quizSaveError = makeActionCreator(QUIZ_SAVE_ERROR)
actions.updateContentItem = makeActionCreator(CONTENT_ITEM_UPDATE, 'id', 'propertyPath', 'value')
actions.updateContentItemDetail = makeActionCreator(CONTENT_ITEM_DETAIL_UPDATE, 'id', 'subAction')
actions.updateItemObjects = makeActionCreator(ITEM_OBJECTS_UPDATE, 'itemId', 'updateType', 'data')
actions.moveQuestionStep = makeActionCreator(QUESTION_MOVE, 'itemId', 'stepId')

actions.createItem = (stepId, type) => {
  invariant(stepId, 'stepId is mandatory')
  invariant(type, 'type is mandatory')
  return {
    type: ITEM_CREATE,
    id: makeId(),
    stepId,
    itemType: type
  }
}

actions.createStep = (position) => {
  invariant(position, 'position is mandatory')
  return {
    type: STEP_CREATE,
    id: makeId(),
    title: `${tex('step')} ${position}`
  }
}

actions.deleteStepAndItems = id => {
  invariant(id, 'id is mandatory')
  return (dispatch, getState) => {
    dispatch(actions.nextObject(select.nextObject(getState())))
    //I'll gave to double check that
    getState().steps[id].items.forEach(item => {
      dispatch(actions.deleteStepItem(item, id))
    })

    dispatch(actions.deleteStep(id))
  }
}

actions.deleteStepItem = (id, stepId) => {
  invariant(id, 'id is mandatory')
  invariant(stepId, 'stepId is mandatory')

  return (dispatch, getState) => {
    const state = getState()
    const steps = select.steps(state)
    let countItems = 0

    forOwn(steps, step => {
      step.items.forEach(item => {
        countItems += item === id ? 1: 0
      })
    })

    dispatch({
      type: STEP_ITEM_DELETE,
      id,
      stepId
    })

    if (countItems <= 1) {
      dispatch(actions.deleteItem(id))
    }
  }
}

actions.save = () => {
  return (dispatch, getState) => {
    const state = getState()

    if (!select.valid(state)) {
      dispatch(actions.quizValidating())
      dispatch(modalActions.showModal(MODAL_MESSAGE, {
        title: tex('editor_invalid_no_save'),
        message: tex('editor_invalid_no_save_desc'),
        bsStyle: 'warning'
      }))
    } else {
      const denormalized = denormalize(state.quiz, state.steps, state.items)
      dispatch({
        [REQUEST_SEND]: {
          route: ['exercise_update', {id: state.quiz.id}],
          request: {
            method: 'PUT' ,
            body: JSON.stringify(denormalized)
          },
          before: () => dispatch(actions.quizSaving()),
          success: () => dispatch(actions.quizSaved()),
          failure: () => dispatch(actions.quizSaveError())
        }
      })
    }
  }
}

actions.saveContentItemFile = (itemId, file) => {
  return (dispatch) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('sourceType', 'exo_content_item')

    dispatch({
      [REQUEST_SEND]: {
        route: ['upload_public_file'],
        request: {
          method: 'POST',
          body: formData
        },
        success: (url) => {
          dispatch(actions.updateContentItem(itemId, 'data', url))
        }
      }
    })
  }
}

actions.createContentItem = (stepId, type, data = '') => {
  invariant(stepId, 'stepId is mandatory')
  invariant(type, 'type is mandatory')
  return {
    type: CONTENT_ITEM_CREATE,
    id: makeId(),
    stepId,
    contentType: type,
    data: data
  }
}

actions.createItemObject = (itemId, type) => {
  invariant(itemId, 'itemId is mandatory')
  invariant(type, 'type is mandatory')
  return {
    type: ITEM_OBJECTS_UPDATE,
    id: makeId(),
    itemId: itemId,
    updateType: OBJECT_ADD,
    data: {
      mimeType: type
    }
  }
}

actions.saveItemObjectFile = (itemId, objectId, file) => {
  return (dispatch) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileName', file.name)
    formData.append('sourceType', 'exo_item_object')

    dispatch({
      [REQUEST_SEND]: {
        route: ['upload_public_file'],
        request: {
          method: 'POST',
          body: formData
        },
        success: (url) => {
          dispatch(actions.updateItemObjects(itemId, 'OBJECT_CHANGE', {id: objectId, property: 'data', value: url}))
        }
      }
    })
  }
}
