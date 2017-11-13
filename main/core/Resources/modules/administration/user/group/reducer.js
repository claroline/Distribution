import {combineReducers} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

const reducer = combineReducers({
  list: makeListReducer('groups.list'),
  current: makeFormReducer('groups.current', {
    users: makeListReducer('groups.current.users'),
    roles: makeListReducer('groups.current.roles'),
    organizations: makeListReducer('groups.current.organizations')
  })
})

export {
  reducer
}
