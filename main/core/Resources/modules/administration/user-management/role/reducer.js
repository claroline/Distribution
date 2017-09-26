import {makeReducer} from '#/main/core/utilities/redux'
import merge from 'lodash/merge'
import set from 'lodash/set'
import unset from 'lodash/unset'
import update from 'immutability-helper'
import {updateArray} from '#/main/core/administration/user-management/utils/redux'

import {
  ROLES_LOAD,
  ROLE_EDIT
} from './actions'

const handlers = {
  [ROLES_LOAD]: (state, action) => {
    return {
      data: action.roles,
      totalResults: action.total
    }
  },
  [ROLE_EDIT]: (state, action) => {
    const idx = state.data.findIndex(el => el.id === action.id)
    const el = merge({}, state.data[idx], {[action.parameter]: action.value})
    const data = updateArray(state.data, idx, el)
    console.log(data)
    return update(state, {'data': {$set: data}})
  }
}

const reducer = makeReducer({
  data: [],
  totalResults: 0
}, handlers)

export {
  reducer
}
