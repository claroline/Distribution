import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const TOOL_ADD = 'TOOL_ADD'
export const TOOL_REMOVE = 'TOOL_REMOVE'

export const actions = {}

actions.addTool = makeActionCreator(TOOL_ADD, 'tool')
actions.removeTool = makeActionCreator(TOOL_REMOVE, 'toolId')

actions.saveTool = (tool) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_tool_save'),
    request: {
      method: 'POST',
      body: JSON.stringify(tool)
    },
    success: (data, dispatch) => {
      dispatch(actions.addTool(data))
    }
  }
})