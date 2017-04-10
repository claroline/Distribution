import {makeReducer} from '#/main/core/utilities/redux'
import { combineReducers } from 'redux'

export const CHANGE_PAGE = 'CHANGE_PAGE'

function changePage(state) {
  return state
}

export const reducers = combineReducers({
  pager: makeReducer(0, {
    [CHANGE_PAGE]: changePage
  })
})
