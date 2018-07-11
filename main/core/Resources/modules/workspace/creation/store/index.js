import {combineReducers} from '#/main/core/scaffolding/reducer'

import {makeFormReducer} from '#/main/core/data/form/reducer'

const reducer = combineReducers({
  //chemin de l'admin
  workspace: makeFormReducer('workspaces.creation.workspace', {}, {})
  //rajouter les autres store ici
})

export {
  reducer
}
