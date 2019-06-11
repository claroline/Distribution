import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'

import {TOOL_LOAD} from '#/main/core/tool/store/actions'
import {RESOURCE_OPEN} from '#/main/core/tools/resources/store/actions'

const reducer = combineReducers({
  root: makeReducer(null, {
    [makeInstanceAction(TOOL_LOAD, 'resource_manager')]: (state, action) => action.toolData.root || null
  }),
  current: makeReducer(null, {

  })
})

export {
  reducer
}
