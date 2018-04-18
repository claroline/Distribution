import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {
  LOAD_OVERVIEW,
  LOAD_AUDIENCE,
  LOAD_RESOURCES,
  LOAD_WIDGETS,
  LOAD_TOP_ACTIONS
} from '#/main/core/administration/analytics/actions'

const reducer = makePageReducer([], {
  overview: combineReducers({
    loaded: makeReducer(false, {
      [LOAD_OVERVIEW] : () => true
    }),
    data: makeReducer({}, {
      [LOAD_OVERVIEW]: (state, action) => action.data
    })
  }),
  audience: combineReducers({
    loaded: makeReducer(false, {
      [LOAD_AUDIENCE] : () => true
    }),
    data: makeReducer({}, {
      [LOAD_AUDIENCE]: (state, action) => action.data
    })
  }),
  resources: combineReducers({
    loaded: makeReducer(false, {
      [LOAD_RESOURCES] : () => true
    }),
    data: makeReducer({}, {
      [LOAD_RESOURCES]: (state, action) => action.data
    })
  }),
  widgets: combineReducers({
    loaded: makeReducer(false, {
      [LOAD_WIDGETS] : () => true
    }),
    data: makeReducer({}, {
      [LOAD_WIDGETS]: (state, action) => action.data
    })
  }),
  topActions: combineReducers({
    loaded: makeReducer(false, {
      [LOAD_TOP_ACTIONS] : () => true
    }),
    data: makeReducer({}, {
      [LOAD_TOP_ACTIONS]: (state, action) => action.data
    })
  })
})

export {reducer}