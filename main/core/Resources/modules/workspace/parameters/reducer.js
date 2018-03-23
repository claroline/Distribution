import {makePageReducer} from '#/main/core/layout/page/reducer'

import {reducer as workspaceReducer} from '#/main/core/workspace/parameters/parameters/reducer'

const reducer = makePageReducer({}, {
  parameters: workspaceReducer
})

export {
  reducer
}
