import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as modalActions} from '#/main/core/layout/modal/actions'

import {isValid} from '#/plugin/drop-zone/plugin/configuration/validator'

export const TOOL_FORM_LOAD = 'TOOL_FORM_LOAD'
export const TOOL_FORM_RESET = 'TOOL_FORM_RESET'
export const TOOL_FORM_UPDATE = 'TOOL_FORM_UPDATE'
export const TOOL_FORM_VALIDATE = 'TOOL_FORM_VALIDATE'
export const TOOL_UPDATE = 'TOOL_UPDATE'
export const TOOL_REMOVE = 'TOOL_REMOVE'

export const actions = {}

actions.loadToolForm = makeActionCreator(TOOL_FORM_LOAD, 'tool')
actions.resetToolForm = makeActionCreator(TOOL_FORM_RESET)
actions.updateToolForm = makeActionCreator(TOOL_FORM_UPDATE, 'property', 'value')
actions.validateToolForm = makeActionCreator(TOOL_FORM_VALIDATE)
actions.updateTool = makeActionCreator(TOOL_UPDATE, 'tool')
actions.removeTool = makeActionCreator(TOOL_REMOVE, 'toolId')

actions.submitTool = (tool) => {
  return (dispatch) => {
    dispatch(actions.validateToolForm())

    if (isValid(tool)) {
      dispatch(actions.saveTool(tool))
    }
  }
}

actions.saveTool = (tool) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_tool_save'),
    request: {
      method: 'POST',
      body: JSON.stringify(tool)
    },
    success: (data, dispatch) => {
      dispatch(actions.updateTool(data))
      dispatch(modalActions.fadeModal())
      dispatch(actions.resetToolForm())
    }
  }
})

actions.deleteTool = (toolId) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_tool_delete', {id: toolId}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.removeTool(toolId))
    }
  }
})