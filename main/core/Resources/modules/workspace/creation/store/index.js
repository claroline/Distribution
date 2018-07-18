import cloneDeep from 'lodash/cloneDeep'

import {combineReducers} from '#/main/core/scaffolding/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeReducer} from '#/main/app/store/reducer'
import {reducer as logReducer} from '#/main/core/workspace/creation/components/log/reducer'

import {LOAD_MODEL} from '#/main/core/workspace/creation/store/actions'
import {LOAD_CURRENT} from '#/main/core/workspace/creation/store/actions'

const reducer = combineReducers({
  //chemin de l'admin
  workspace: makeFormReducer('workspaces.creation.workspace', {}, {
    data: makeReducer({}, {
      [LOAD_CURRENT]: (state, action) => {
        const data = cloneDeep(state)
        data.id = action.data.uuid
        
        return data
      }
    })
  }),
  roles: makeFormReducer('workspaces.creation.roles', {}, {}),
  tools: makeFormReducer('workspaces.creation.tools', {}, {}),
  home: makeFormReducer('workspaces.creation.home', {}, {}),
  resources: makeFormReducer('workspaces.creation.resources', {}, {}),
  model: makeReducer({}, {
    [LOAD_MODEL]: (state, action) => action.data
  }, {roles: []}),
  log: logReducer
})

export {
  reducer
}
