import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {reducer as apiReducer} from '#/main/core/api/reducer'
import {reducer as modalReducer} from '#/main/core/layout/modal/reducer'
import {makeListReducer} from '#/main/core/layout/list/reducer'

import {
  THEME_ADD,
  THEME_DELETE
} from './actions'

const handlers = {
  [THEME_ADD]: (state, action) => {
    return state
  },
  [THEME_DELETE]: (state, action) => {
    return state
  }
}

const reducer = combineReducers({
  currentRequests: apiReducer,
  themes: makeReducer([], handlers),
  list: makeListReducer(),
  modal: modalReducer
})

export {
  reducer
}
