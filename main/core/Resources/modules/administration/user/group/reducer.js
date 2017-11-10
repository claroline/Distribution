import {generateUrl} from '#/main/core/fos-js-router'
import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

import {validate} from './validator'

const reducer = combineReducers({
  list: makeListReducer('groups.list'),
  current: makeFormReducer({
    users: makeListReducer(),
    roles: makeListReducer(),
    organizations: makeListReducer()
  }, validate)
})

export {
  reducer
}
