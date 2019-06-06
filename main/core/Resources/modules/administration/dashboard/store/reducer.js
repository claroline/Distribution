import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'

import {makeLogReducer} from '#/main/core/layout/logs/reducer'

import {
  LOAD_OVERVIEW,
  LOAD_AUDIENCE,
  LOAD_RESOURCES,
  LOAD_WIDGETS
} from '#/main/core/administration/dashboard/store/actions'

const reducer = makeLogReducer({}, {
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
  topActions: makeListReducer('topActions', {
    filters: [{property: 'type', value: 'top_users_connections'}]
  }),
  connections: combineReducers({
    list: makeListReducer('connections.list', {
      sortBy: {property: 'connectionDate', direction: -1}
    })
  })
})

export {reducer}