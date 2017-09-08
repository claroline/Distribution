import {makeReducer} from '#/main/core/utilities/redux'

import {
  USERS_LOAD
} from './actions'

const handlers = {
  [USERS_LOAD]: (state, action) => {
    return {
      data: action.users,
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
