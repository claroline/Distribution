import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

import {validate} from './validator'

const reducer = combineReducers({
  list: makeListReducer(),
  current: makeFormReducer({
    roles: makeListReducer()
  }, validate)
})

export {
  reducer
}
