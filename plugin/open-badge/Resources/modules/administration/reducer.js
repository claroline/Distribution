import {combineReducers, makeReducer} from '#/main/app/store/reducer'

import {makeListReducer} from '#/main/app/content/list/store'
import {makeFormReducer} from '#/main/app/content/form/store/reducer'

import {reducer as creationReducer} from '#/main/core/workspace/creation/store'

const reducer = {
  workspaces: combineReducers({
    creation: creationReducer,
    list: makeListReducer('workspaces.list')
  })
}

export {
  reducer
}
