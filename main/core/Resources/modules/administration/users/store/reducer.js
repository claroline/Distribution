import {makeInstanceAction} from '#/main/app/store/actions'
import {makeReducer, combineReducers} from '#/main/app/store/reducer'
import {makeListReducer} from '#/main/app/content/list/store'
import {TOOL_LOAD} from '#/main/core/tool/store/actions'

import {reducer as parametersReducer} from '#/main/core/administration/users/parameters/reducer'
import {reducer as usersReducer} from '#/main/core/administration/users/user/reducer'
import {reducer as groupsReducer} from '#/main/core/administration/users/group/reducer'
import {reducer as rolesReducer} from '#/main/core/administration/users/role/reducer'
import {reducer as profileReducer} from '#/main/core/administration/users/profile/reducer'
import {reducer as organizationReducer} from '#/main/core/administration/users/organization/reducer'
import {reducer as locationReducer} from '#/main/core/administration/users/location/reducer'

const reducer = combineReducers({
  parameters: parametersReducer,
  users: usersReducer,
  groups: groupsReducer,
  roles: rolesReducer,
  locations: locationReducer,
  profile: profileReducer,
  organizations: organizationReducer,
  platformRoles: makeReducer({}, {
    [makeInstanceAction(TOOL_LOAD, 'user_management')]: (state, action) => action.toolData.platformRoles.data
  }),

  // deprecated
  workspaces: combineReducers({
    picker: makeListReducer('workspaces.picker')
  })
})

export {
  reducer
}
