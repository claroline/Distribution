import {combineReducers} from '#/main/core/scaffolding/reducer'

import {reducer as workspaceReducer} from '#/main/core/administration/workspace/workspace/reducer'
import {reducer as parametersReducer} from '#/main/core/administration/workspace/parameters/reducer'

const reducer = combineReducers({
  workspace: workspaceReducer,
  parameters: parametersReducer
})

export {
  reducer
}
