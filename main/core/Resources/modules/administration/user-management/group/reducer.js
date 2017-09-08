import {makeReducer} from '#/main/core/utilities/redux'

import {
  GROUPS_LOAD
} from './actions'

const handlers = {
  [GROUPS_LOAD]: (state, action) => {
    return {
      data: action.groups,
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
