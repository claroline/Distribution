import {makeReducer, combineReducers} from '#/main/app/store/reducer'

import {PATHS_DATA_LOAD} from '#/main/core/tools/dashboard/path/store/actions'

const reducer = combineReducers({
  trackings: makeReducer([], {
    [PATHS_DATA_LOAD]: (state, action) => action.trackings
  }),
})

export {
  reducer
}
