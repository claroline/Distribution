import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

import {PLATFORM_ROLE} from '#/main/core/administration/user/role/constants'

const reducer = combineReducers({
  list: makeListReducer('roles.list', {
    filters: [{property: 'type', value: PLATFORM_ROLE}]
  }),
  current: makeFormReducer('roles.current', {}, {
    users: makeListReducer('roles.current.users'),
    groups: makeListReducer('roles.current.groups')
  })
})

export {
  reducer
}
