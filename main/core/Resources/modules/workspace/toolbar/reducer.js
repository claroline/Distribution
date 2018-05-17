import {makeReducer} from '#/main/core/scaffolding/reducer'

import {reducer as modalReducer} from '#/main/app/overlay/modal/reducer'

const reducer = {
  modal: modalReducer, // will use the one from the main app later

  // the current workspace
  workspace: makeReducer({}, {}),

  // the available tools in the workspace for the current user
  tools: makeReducer([], {}),

  // the roles which can access to the workspace
  roles: makeReducer([], {})
}

export {
  reducer
}
