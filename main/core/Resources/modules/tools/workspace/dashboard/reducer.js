import {makeReducer} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'

const reducer = makePageReducer([], {
  workspaceId: makeReducer(null, {}),
  actions: makeReducer([], {}),
  activityChart: makeReducer({}, {}),
  resourcesChart: makeReducer({}, {})
})

export {reducer}