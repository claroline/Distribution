import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

const reducer = combineReducers({
  list: makeListReducer('users.list'),
  current: makeFormReducer('users.current', {
    roles: makeListReducer('users.current.roles'),
    groups: makeListReducer('users.current.groups')
  })
})

export {
  reducer
}
