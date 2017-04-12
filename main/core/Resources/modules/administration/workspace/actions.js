import { makeActionCreator } from '#/main/core/utilities/redux'
import { REQUEST_SEND } from '#/main/core/utilities/api/actions'
import { makeReducer } from '#/main/core/utilities/redux'
import cloneDeep from 'lodash/cloneDeep'

const PAGE_CHANGE = 'PAGE_CHANGE'

export const actions = {
  pageChange: makeActionCreator(PAGE_CHANGE, 'total', 'workspaces', 'current', 'pageSize'),
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
  }
}

export const reducers = makeReducer(initialState, handlers)
