import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

import {PLATFORM_ROLE} from '#/main/core/administration/user/role/constants'

const reducer = combineReducers({
  list: makeListReducer('users.list'),
  current: makeFormReducer('users.current', {}, {
    workspaces: makeListReducer('users.current.workspaces'),
    groups: makeListReducer('users.current.groups'),
    organizations: makeListReducer('users.current.organizations'),
    roles: makeListReducer('users.current.roles', {
      filters: [{property: 'type', value: PLATFORM_ROLE}]
    })
  })
})

export {
  reducer
}
