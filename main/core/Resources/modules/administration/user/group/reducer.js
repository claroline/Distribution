import {generateUrl} from '#/main/core/fos-js-router'
import {combineReducers} from '#/main/core/utilities/redux'

import {makeListReducer} from '#/main/core/layout/list/reducer'
import {makeFormReducer} from '#/main/core/layout/form/reducer'

import {validate} from './validator'

const reducer = combineReducers({
  list: makeListReducer({fetchUrl: generateUrl('apiv2_group_list')}),
  current: makeFormReducer({
    users: makeListReducer({}, {fetchUrl: generateUrl('apiv2_user_list')}),
    roles: makeListReducer(),
    organizations: makeListReducer()
  }, validate)
})

export {
  reducer
}
