import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = makePageReducer([], {
  logs: makeListReducer('logs', {
    sortBy: { property: 'dateLog', direction: -1 }
  }, {}),
  log: makeReducer({}, {}, {}),
  workspaceId: makeReducer(null, {}, {})
})

export {reducer}