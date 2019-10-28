import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {SEARCH_FILTER_ADD, SEARCH_FILTER_REMOVE} from '#/main/app/content/search/store/actions'

import {TOOL_LOAD} from '#/main/core/tool/store/actions'
import {LOAD_LOG, RESET_LOG, LOAD_CHART_DATA} from '#/main/core/layout/logs/actions'
import {
  LOAD_AUDIENCE
} from '#/plugin/analytics/administration/dashboard/store/actions'
import {selectors} from '#/plugin/analytics/administration/dashboard/store/selectors'

const reducer = combineReducers({
  userActions: makeListReducer(selectors.STORE_NAME + '.userActions', {
    sortBy: { property: 'doer.name', direction: 1 }
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: () => true
    })
  }),
  log: makeReducer({}, {
    [RESET_LOG]: (state, action) => action.log,
    [LOAD_LOG]: (state, action) => action.log
  }),
  chart: combineReducers({
    invalidated: makeReducer(true, {
      [SEARCH_FILTER_ADD + '/' + selectors.STORE_NAME + '.logs'] : () => true,
      [SEARCH_FILTER_REMOVE + '/' + selectors.STORE_NAME + '.logs'] : () => true,
      [LOAD_CHART_DATA] : () => false
    }),
    data: makeReducer({}, {
      [LOAD_CHART_DATA]: (state, action) => action.data
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
  topActions: makeListReducer(selectors.STORE_NAME + '.topActions', {
    filters: [{property: 'type', value: 'top_users_connections'}]
  }, {
    invalidated: makeReducer(false, {
      [makeInstanceAction(TOOL_LOAD, selectors.STORE_NAME)]: () => true
    })
  })
})

export {
  reducer
}
