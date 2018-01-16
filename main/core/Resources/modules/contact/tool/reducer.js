import {combineReducers, makeReducer} from '#/main/core/scaffolding/reducer'
import {makePageReducer} from '#/main/core/layout/page/reducer'
import {makeListReducer} from '#/main/core/data/list/reducer'

const reducer = makePageReducer({}, {
  options: makeReducer({}, {}),
  contacts: makeListReducer('contacts'),
  users: combineReducers({
    contactable: makeListReducer('users.contactable'),
    picker: makeListReducer('users.picker')
  })
})

export {
  reducer
}