import {combineReducers, makeReducer} from '#/main/core/utilities/redux'

import {makeFormReducer} from '#/main/core/data/form/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = combineReducers({
  list: makeListReducer('organizations.list', {}, {}, {
    sortable: false,
    paginated: false
  }),
  current: makeFormReducer('organizations.current', {}, {
    workspaces: makeListReducer('organizations.current.workspaces'),
    users: makeListReducer('organizations.current.users'),
    groups: makeListReducer('organizations.current.groups')
  })
})

export {
  reducer
}
