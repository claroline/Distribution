import {makeReducer, combineReducers} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {LOAD_LOG, RESET_LOG, LOAD_CHART_DATA} from '#/main/core/tools/workspace/logs/actions'
import {LIST_FILTER_ADD, LIST_FILTER_REMOVE} from '#/main/core/data/list/actions'

const reducer = makePageReducer([], {
  logs: makeListReducer('logs', {
    sortBy: { property: 'dateLog', direction: -1 }
  }, {}),
  log: makeReducer({}, {
    [RESET_LOG]: (state, action) => action.log,
    [LOAD_LOG]: (state, action) => action.log
  }),
  workspaceId: makeReducer(null, {}, {}),
  chart: combineReducers({
    invalidated: makeReducer(true, {
      [LIST_FILTER_ADD+'/logs'] : () => true,
      [LIST_FILTER_REMOVE+'/logs'] : () => true,
      [LOAD_CHART_DATA] : () => false
    }),
    data: makeReducer({}, {
      [LOAD_CHART_DATA]: (state, action) => action.data
    })
  })
})

export {reducer}