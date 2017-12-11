import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/data/list/reducer'
import {makeFormReducer} from '#/main/core/data/form/reducer'

const reducer = combineReducers({
  list: makeListReducer('locations.list'),
  current: makeFormReducer('locations.current', {}, {
    users: makeListReducer('locations.current.users'),
    organizations: makeListReducer('locations.current.organizations'),
    groups: makeListReducer('locations.current.groups')
  })
})

export {
  reducer
}
