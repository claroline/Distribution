import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import CHANGE_ORGANIZATION from './actions'

const handlers = {
  [CHANGE_ORGANIZATION]: (state, action) => {
    state = cloneDeep(state)
    const organization = action.organization

    return state
  }
}

const reducer = combineReducers({
  organizations: makeReducer({}, {}),
  options: makeReducer({}, handlers)
})

export {
  reducer
}
