import cloneDeep from 'lodash/cloneDeep'

import { makeReducer, combineReducers } from '#/main/core/utilities/redux'
import {reducer as paginationReducer} from '#/main/core/layout/pagination/reducer'
import {reducer as listReducer} from '#/main/core/layout/list/reducer'

import {
  PAGE_CHANGE,
  DELETE_WORKSPACES,
  ON_SELECT,
  COPY_WORKSPACE,
  UPDATE_WORKSPACE
} from './actions'

const handlers = {
  [PAGE_CHANGE]: (state, action) => {
    state = cloneDeep(state)

    state.totalResults = action.total
    state.data = action.workspaces
    //state.current = action.current
    //state.pageSize = action.pageSize

    return state
  },
  [DELETE_WORKSPACES]: (/*state, action*/) => {
    alert('gotcha the handler')
  },
  [ON_SELECT]: (state, action) => {
    return Object.assign({}, state, {selected: action.selected})
  },
  [COPY_WORKSPACE]: (state) => {
    return state
  },
  [UPDATE_WORKSPACE]: (state) => {
    return state
  }
}

const selectedHandlers = {
  // deselect all on page change
  [PAGE_CHANGE]: (state, action) => []
}

const reducer = combineReducers({
  totalResults: makeReducer(0, {}),
  workspaces: makeReducer({
    data: [],
    totalResults: 0
  }, handlers),
  user: makeReducer({}, {}),
  selected: makeReducer([], selectedHandlers), // todo : may be put it in `list` object
  pagination: paginationReducer,
  list: listReducer
})

export {reducer}