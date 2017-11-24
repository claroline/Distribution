import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

const reducer = combineReducers({
  list: makeListReducer('locations.list'),
  current: makeFormReducer('locations.current', {
    users: makeListReducer('locations.current.users'),
    organizations: makeListReducer('locations.current.organizations')
  })
})

export {
  reducer
}
