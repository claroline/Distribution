import {makeReducer} from '#/main/core/utilities/redux'
import merge from 'lodash/merge'
import set from 'lodash/set'
import unset from 'lodash/unset'
import update from 'immutability-helper'
import {updateArray} from '#/main/core/administration/user-management/utils/redux'

import {
  ROLES_LOAD,
  ROLE_EDIT,
  ROLE_ADD
} from './actions'

const handlers = {
  [ROLES_LOAD]: (state, action) => {
    return {
      data: action.roles,
      totalResults: action.total
    }
  },
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
