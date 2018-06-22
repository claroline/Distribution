import {combineReducers} from '#/main/core/scaffolding/reducer'

import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = {
  workspaces: makeListReducer('workspaces', {})
}

export {
  reducer
}
