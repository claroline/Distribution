import invariant from 'invariant'
import {makeActionCreator, makeInstanceActionCreator} from '#/main/app/store/actions'

import {constants} from '#/main/core/tool/constants'

// actions
export const TOOL_OPEN        = 'TOOL_OPEN'
export const TOOL_CLOSE       = 'TOOL_CLOSE'
export const TOOL_LOAD        = 'TOOL_LOAD'
export const TOOL_SET_LOADED  = 'TOOL_SET_LOADED'
export const TOOL_SET_CONTEXT = 'TOOL_SET_CONTEXT'

// action creators
export const actions = {}

actions.load = makeInstanceActionCreator(TOOL_LOAD, 'toolData')
actions.setLoaded = makeActionCreator(TOOL_SET_LOADED)

actions.open = makeActionCreator(TOOL_OPEN, 'name', 'context')
actions.close = makeActionCreator(TOOL_CLOSE)

actions.setContext = (contextType, contextData = null) => {
  invariant(contextType, 'contextType is required')

  const tools = Object.keys(constants.TOOL_TYPES)
  invariant(-1 !== tools.indexOf(contextType), `contextType is invalid. Allowed : ${tools.join(', ')}.`)

  return {
    type: TOOL_SET_CONTEXT,
    contextType,
    contextData
  }
}
