import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

import {PLATFORM_ROLE} from '#/main/core/user/role/constants'

const reducer = combineReducers({
  picker: makeListReducer('roles.picker', {
    filters: [{property: 'type', value: PLATFORM_ROLE}]
  }),
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
