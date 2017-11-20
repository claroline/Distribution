import cloneDeep from 'lodash/cloneDeep'
import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

// generic reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'

import {
  TOOL_ADD,
  TOOL_REMOVE
} from './actions'

const toolsReducer = makeReducer({}, {
  [TOOL_ADD]: (state, action) => {
    const tools = cloneDeep(state)
    tools.push(action.tool)

    return tools
  },
  [TOOL_REMOVE]: (state, action) => {
    const tools = cloneDeep(state)
    const index = tools.findIndex(t => t.id === action.toolId)

    if (index > -1) {
      tools.splice(index, 1)
    }

    return tools
  }
})

const toolsListReducer = makeListReducer(
  {data: toolsReducer},
  {selectable: false, filterable: false, paginated: false, sortable: false}
)

const reducer = {
  tools: toolsListReducer,

  // generic reducers
  currentRequests: apiReducer,
  modal: modalReducer
}

export {
  reducer
}
