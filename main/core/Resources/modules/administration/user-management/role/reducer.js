import {makeReducer} from '#/main/core/utilities/redux'

import {
  ROLES_LOAD
} from './actions'

const handlers = {
  [ROLES_LOAD]: (state, action) => {
    return {
      data: action.roles,
      totalResults: action.total
    }
  }
}

const reducer = makeReducer({
  data: [],
  totalResults: 0
}, handlers)

export {
  reducer
}
