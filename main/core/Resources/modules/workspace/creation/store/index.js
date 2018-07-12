import {combineReducers} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeReducer} from '#/main/app/store/reducer'

import {LOAD_MODEL} from '#/main/core/workspace/creation/store/actions'

const reducer = combineReducers({
  //chemin de l'admin
  workspace: makeFormReducer('workspaces.creation.workspace', {}, {}),
  model: makeReducer({}, {
    [LOAD_MODEL]: (state, action) => action.data
  })
})

export {
  reducer
}
