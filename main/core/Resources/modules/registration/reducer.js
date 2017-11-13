import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/utilities/redux'

import {
  USER_UPDATE
} from './actions'

const userReducer = makeReducer({}, {
  [USER_UPDATE]: (state, action) => {
    state = cloneDeep(state)
    state[action.property] = action.value

    return state
  }
})

export {
  userReducer as reducer
}
