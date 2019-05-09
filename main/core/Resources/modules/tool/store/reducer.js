import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {
  TOOL_OPEN,
  TOOL_CLOSE,
  TOOL_SET_LOADED,
  TOOL_SET_CONTEXT
} from '#/main/core/tool/store/actions'

const reducer = combineReducers({
  loaded: makeReducer(false, {
    [TOOL_SET_LOADED]: () => true,
    [TOOL_CLOSE]: () => false
  }),
  name: makeReducer(null, {
    [TOOL_OPEN]: (state, action) => action.name,
    [TOOL_CLOSE]: () => null
  }),
  currentContext: makeReducer({}, {
    [TOOL_OPEN]: (state, action) => action.context,
    [TOOL_CLOSE]: () => ({}),
    [TOOL_SET_CONTEXT]: (state, action) => ({
      type: action.contextType,
      data: action.contextData
    })
  })
})

export {
  reducer
}
