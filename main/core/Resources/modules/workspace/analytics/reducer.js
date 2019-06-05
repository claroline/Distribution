import {makeReducer, combineReducers} from '#/main/app/store/reducer'

import {makeLogReducer} from '#/main/core/layout/logs/reducer'
import {reducer as connectionsReducer} from '#/main/core/workspace/logs/connection/store/reducer'
import {LOAD_DASHBOARD} from '#/main/core/workspace/analytics/actions'

const reducer = makeLogReducer({}, {
  workspace: makeReducer(null, {}),
  dashboard: combineReducers({
    loaded: makeReducer(false, {
      [LOAD_DASHBOARD] : () => true
    }),
    data: makeReducer({}, {
      [LOAD_DASHBOARD]: (state, action) => action.data
    })
  }),
  connections: connectionsReducer
})

export {
  reducer
}
