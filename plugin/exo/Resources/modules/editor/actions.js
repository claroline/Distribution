import invariant from 'invariant'
import select from './selectors'
import {makeActionCreator, makeId} from './util'

export const ITEM_CREATE = 'ITEM_CREATE'
export const ITEM_DELETE = 'ITEM_DELETE'
export const ITEM_MOVE = 'ITEM_MOVE'
export const ITEMS_DELETE = 'ITEMS_DELETE'
export const MODAL_FADE = 'MODAL_FADE'
export const MODAL_HIDE = 'MODAL_HIDE'
export const MODAL_SHOW = 'MODAL_SHOW'
export const OBJECT_NEXT = 'OBJECT_NEXT'
export const OBJECT_SELECT = 'OBJECT_SELECT'
export const PANEL_QUIZ_SELECT = 'PANEL_QUIZ_SELECT'
export const PANEL_STEP_SELECT = 'PANEL_STEP_SELECT'
export const STEP_CREATE = 'STEP_CREATE'
export const STEP_DELETE = 'STEP_DELETE'
export const STEP_MOVE = 'STEP_MOVE'

export const actions = {}

actions.deleteStep = makeActionCreator(STEP_DELETE, 'id')
actions.deleteItem = makeActionCreator(ITEM_DELETE, 'id', 'stepId')
actions.deleteItems = makeActionCreator(ITEMS_DELETE, 'ids')
actions.fadeModal = makeActionCreator(MODAL_FADE)
actions.hideModal = makeActionCreator(MODAL_HIDE)
actions.moveItem = makeActionCreator(ITEM_MOVE, 'id', 'swapId', 'stepId')
actions.moveStep = makeActionCreator(STEP_MOVE, 'id', 'swapId')
actions.nextObject = makeActionCreator(OBJECT_NEXT, 'object')
actions.selectObject = makeActionCreator(OBJECT_SELECT, 'id', 'objectType')
actions.selectQuizPanel = makeActionCreator(PANEL_QUIZ_SELECT, 'panelKey')
actions.selectStepPanel = makeActionCreator(PANEL_STEP_SELECT, 'stepId', 'panelKey')
actions.showModal = makeActionCreator(MODAL_SHOW, 'modalType', 'modalProps')

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

actions.createStep = () => {
  return {
    type: STEP_CREATE,
    id: makeId()
  }
}

actions.deleteStepAndItems = id => {
  invariant(id, 'id is mandatory')
  return (dispatch, getState) => {
    dispatch(actions.nextObject(select.nextObject(getState())))
    dispatch(actions.deleteItems(getState().steps[id].items.slice()))
    dispatch(actions.deleteStep(id))
  }
}
