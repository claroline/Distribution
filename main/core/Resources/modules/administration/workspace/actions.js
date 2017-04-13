import { makeActionCreator } from '#/main/core/utilities/redux'
import { REQUEST_SEND } from '#/main/core/utilities/api/actions'
import { makeReducer } from '#/main/core/utilities/redux'
import cloneDeep from 'lodash/cloneDeep'

const PAGE_CHANGE = 'PAGE_CHANGE'
const ON_SELECT = 'ON_SELECT'
const REMOVE_WORKSPACE = 'REMOVE_WORKSPACE'
const REMOVE_WORKSPACES = 'REMOVE_WORKSPACES'
const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE'

export const actions = {
  pageChange: makeActionCreator(PAGE_CHANGE, 'total', 'workspaces', 'current', 'pageSize'),
  onSelect: makeActionCreator(ON_SELECT, 'selected'),
  removeWorkspace: makeActionCreator(REMOVE_WORKSPACE, 'workspace'),
  removeWorkspaces: makeActionCreator(REMOVE_WORKSPACES, 'workspaces'),
  updateWorkspace: makeActionCreator(UPDATE_WORKSPACE, 'workspace'),
  fetchPage: (current, pageSize) => ({
    [REQUEST_SEND]: {
      route: ['api_get_search_workspaces', {page: current++, limit: pageSize}],
      request: {
        method: 'GET'
      },
      success: (data, dispatch) => {
        dispatch(actions.pageChange(data.total, data.workspaces, current, pageSize))
      },
      failure: () => alert('fail')
    }
  })
}

const initialState = {
  user: {}, pager: {}
}

const handlers = {
  [PAGE_CHANGE]: (state, action) => {
    const pagination = cloneDeep(state.pagination)
    pagination.totalResults = action.total
    pagination.data = action.workspaces
    pagination.current = action.current
    pagination.pageSize = action.pageSize

    return Object.assign({}, state, {pagination})
  },
  [ON_SELECT]: (state, action) => {
    const pagination = cloneDeep(state.pagination)
    pagination.selected = action.selected

    return Object.assign({}, state, {pagination})
  },
  [REMOVE_WORKSPACE]: (state) => {
    return state
  },
  [REMOVE_WORKSPACES]: (state) => {
    return state
  },
  [UPDATE_WORKSPACE]: (state) => {
    return state
  }
}

export const reducers = makeReducer(initialState, handlers)
