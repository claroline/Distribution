import { makeActionCreator } from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'

import { REQUEST_SEND } from '#/main/core/utilities/api/actions'

export const PAGE_CHANGE = 'PAGE_CHANGE'
export const ON_SELECT = 'ON_SELECT'
export const DELETE_WORKSPACES = 'DELETE_WORKSPACES'
export const UPDATE_WORKSPACE = 'UPDATE_WORKSPACE'
export const COPY_WORKSPACE = 'COPY_WORKSPACE'

export const actions = {
  pageChange: makeActionCreator(PAGE_CHANGE, 'total', 'workspaces', 'current', 'pageSize'),
  onSelect: makeActionCreator(ON_SELECT, 'selected'),
  updateWorkspace: makeActionCreator(UPDATE_WORKSPACE, 'workspace'),
  removeWorkspaces: (workspaces) => ({
    [REQUEST_SEND] : {
      url: generateUrl('api_delete_workspace') + workspaces.reduce((acc, workspace) => acc += 'ids[]=' + workspace.id + '&', '?'),
      request: {
        method: 'DELETE'
      },
      success: (data, dispatch) => {
        //do something better
        dispatch(actions.fetchPage(1, 20))
      },
      failure: () => alert('fail')
    }
  }),
  copyWorkspaces: (workspaces, isModel = 0) => ({
    [REQUEST_SEND] : {
      url: generateUrl('api_copy_workspaces', {isModel: isModel}) + workspaces.reduce((acc, workspace) => acc += 'ids[]=' + workspace.id + '&', '?'),
      request: {
        method: 'PATCH'
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

