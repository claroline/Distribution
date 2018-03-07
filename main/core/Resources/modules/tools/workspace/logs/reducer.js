import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'
import {LOAD_LOG, RESET_LOG} from '#/main/core/tools/workspace/logs/actions'

const reducer = makePageReducer([], {
  logs: makeListReducer('logs', {
    sortBy: { property: 'dateLog', direction: -1 }
  }, {}),
  log: makeReducer({}, {
    [RESET_LOG]: (state, action) => action.log,
    [LOAD_LOG]: (state, action) => action.log
  }, {}),
  workspaceId: makeReducer(null, {}, {})
})

export {reducer}