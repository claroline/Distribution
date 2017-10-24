import {makeReducer} from '#/main/core/utilities/redux'
import update from 'immutability-helper'
import {updateArray} from '#/main/core/administration/user-management/utils/redux'

import {
  ROLE_EDIT,
  ROLE_ADD
} from './actions'

const handlers = {
  [ROLE_EDIT]: (state, action) => {
    const idx = state.data.findIndex(el => el.id === action.role.id)
    const data = updateArray(state.data, idx, action.role)

    return update(state, {'data': {$set: data}})
  },
  [ROLE_ADD]: (state, action) => {
    return update(state, {'data': {$push: [action.role]}})
  }
}

const reducer = makeReducer({
  data: [],
  totalResults: 0
}, handlers)

export {
  reducer
}
