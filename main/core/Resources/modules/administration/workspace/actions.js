import { makeActionCreator } from '#/main/core/utilities/redux'
import { REQUEST_SEND } from '#/main/core/utilities/api/actions'
import { makeReducer, combineReducers } from '#/main/core/utilities/redux'
import cloneDeep from 'lodash/cloneDeep'
import {generateUrl} from '#/main/core/fos-js-router'

const PAGE_CHANGE = 'PAGE_CHANGE'
const ON_SELECT = 'ON_SELECT'
const DELETE_WORKSPACES = 'DELETE_WORKSPACES'
const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE'
const COPY_WORKSPACE = 'COPY_WORKSPACE'

export const actions = {
  pageChange: makeActionCreator(PAGE_CHANGE, 'total', 'workspaces', 'current', 'pageSize'),
  onSelect: makeActionCreator(ON_SELECT, 'selected'),
  updateWorkspace: makeActionCreator(UPDATE_WORKSPACE, 'workspace'),
  removeWorkspaces: (workspaces) => ({
    [REQUEST_SEND] : {
      url: generateUrl('api_delete_workspace') + workspaces.reduce((acc, workspace) => acc += 'ids=' + workspace.id + '&', '?'),
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        //do somethibg better
        dispatch(actions.fetchPage(1, 20))
      },
      failure: () => alert('fail')
    }
  }),
  copyWorkspaces: (workspaces, isModel = false) => ({
    [REQUEST_SEND] : {
      url: generateUrl('api_copy_workspaces', {isModel: isModel}) + workspaces.reduce((acc, workspace) => acc += 'ids=' + workspace.id + '&', '?'),
      request: {
        method: 'GET'
      },
      success: (data, dispatch) => {
        dispatch(actions.refreshPage())
      }
    }
  }),
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
  pagination: {}
}

const handlers = {
  [PAGE_CHANGE]: (state, action) => {
    state = cloneDeep(state)

    state.totalResults = action.total
    state.data = action.workspaces
    state.current = action.current
    state.pageSize = action.pageSize

    return state
  },
  [DELETE_WORKSPACES]: (/*state, action*/) => {
    alert('gotcha the hander')
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

export const reducers = combineReducers({
  pagination: makeReducer(initialState, handlers),
  user: makeReducer({user: {}}, {})
})
