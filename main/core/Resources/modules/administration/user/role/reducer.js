import {makeReducer} from '#/main/core/utilities/redux'
import {makeListReducer} from '#/main/core/layout/list/reducer'

import {
  ROLE_EDIT,
  ROLE_ADD
} from './actions'

const rolesReducer = makeReducer([], {
  [ROLE_EDIT]: (state, action) => {
    const newState = cloneDeep(state)

    const idx = state.findIndex(el => el.id === action.role.id)
    if (-1 !== idx) {
      newState[idx] = action.role
    }

    return newState
  },
  [ROLE_ADD]: (state, action) => {
    const newState = cloneDeep(state)
    newState.push(action.role)

    return newState
  }
})

const reducer = makeListReducer({
  data: rolesReducer
})

export {
  reducer
}
