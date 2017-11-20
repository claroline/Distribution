import cloneDeep from 'lodash/cloneDeep'
import set from 'lodash/set'
import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

// generic reducers
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'

import {validate} from '#/plugin/drop-zone/plugin/configuration/validator'

import {
  TOOL_FORM_LOAD,
  TOOL_FORM_RESET,
  TOOL_FORM_UPDATE,
  TOOL_FORM_VALIDATE,
  TOOL_UPDATE,
  TOOL_REMOVE
} from './actions'

const toolFormReducer = makeReducer({
  validating: false,
  pendingChanges: false,
  errors: {},
  data: null
}, {
  [TOOL_FORM_LOAD]: (state, action) => ({
    validating: false,
    pendingChanges: false,
    errors: {},
    data: action.tool
  }),
  [TOOL_FORM_RESET]: () => ({
    validating: false,
    pendingChanges: false,
    errors: {},
    data: null
  }),
  [TOOL_FORM_UPDATE]: (state, action) => {
    const newData = cloneDeep(state.data)
    set(newData, action.property, action.value)

    return {
      validating: false,
      pendingChanges: true,
      errors: validate(newData),
      data: newData
    }
  },
  [TOOL_FORM_VALIDATE]: (state) => ({
    validating: true,
    pendingChanges: state.pendingChanges,
    errors: validate(state.data),
    data: state.data
  })
})

const toolsReducer = makeReducer({}, {
  [TOOL_UPDATE]: (state, action) => {
    const tools = cloneDeep(state)
    const index = tools.findIndex(t => t.id === action.tool.id)

    if (index > -1) {
      tools[index] = action.tool
    } else {
      tools.push(action.tool)
    }

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
  toolForm: toolFormReducer,
  tools: toolsListReducer,

  // generic reducers
  currentRequests: apiReducer,
  modal: modalReducer
}

export {
  reducer
}
