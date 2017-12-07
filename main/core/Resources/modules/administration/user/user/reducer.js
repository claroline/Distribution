import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {PLATFORM_ROLE} from '#/main/core/user/role/constants'

const reducer = combineReducers({
  picker: makeListReducer('users.picker'),
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
