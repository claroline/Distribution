import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

const reducer = combineReducers({
  list: makeListReducer('roles.list'),
  current: makeFormReducer('roles.current')
})

export {
  reducer
}
