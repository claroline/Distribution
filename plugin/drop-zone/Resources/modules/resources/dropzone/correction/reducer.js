import {makeReducer} from '#/main/core/utilities/redux'

import {
  DROPS_LOAD
} from './actions'

const dropsReducer = makeReducer({
  data: [],
  totalResults: 0
}, {
  [DROPS_LOAD]: (state, action) => {
    return action.drops
  }
})

const reducer = {
  drops: dropsReducer
}

export {
  reducer
}
