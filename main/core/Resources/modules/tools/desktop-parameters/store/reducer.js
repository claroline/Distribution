import {makeInstanceAction} from '#/main/app/store/actions'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'
import {reducer as tokenReducer} from '#/main/core/tools/desktop-parameters/token/store/reducer'
import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {TOOL_LOAD} from '#/main/core/tool/store/actions'

const reducer = combineReducers({
  tools: makeReducer([], {
    [makeInstanceAction(TOOL_LOAD, 'parameters')]: (state, action) => action.toolData.tools
  }),
  editable: makeReducer(false, {
  }),
  toolsConfig: makeFormReducer('parameters.toolsConfig'),
  tokens: tokenReducer
})

export {
  reducer
}
