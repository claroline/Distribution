import {combineReducers} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

import {PLATFORM_ROLE} from '#/main/core/administration/user/role/constants'

const reducer = combineReducers({
  list: makeListReducer('groups.list'),
  current: makeFormReducer('groups.current', {
    users: makeListReducer('groups.current.users'),
    roles: makeListReducer('groups.current.roles', {
      filters: [{property: 'type', value: PLATFORM_ROLE}]
    }),
    organizations: makeListReducer('groups.current.organizations')
  })
})

export {
  reducer
}
