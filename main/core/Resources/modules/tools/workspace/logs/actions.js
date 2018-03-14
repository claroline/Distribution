import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/api/router'

export const LOAD_LOG = 'LOAD_LOG'
export const RESET_LOG = 'RESET_LOG'
export const LOAD_CHART_DATA = 'LOAD_CHART_DATA'

export const actions = {}

actions.loadLog = makeActionCreator(LOAD_LOG, 'log')
actions.resetLog = makeActionCreator(RESET_LOG, 'log')
actions.loadChartData = makeActionCreator(LOAD_CHART_DATA, 'data')

actions.openLog = (id, workspaceId) => (dispatch) => {
  dispatch(actions.resetLog({}))
  if (id && workspaceId) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_workspace_tool_logs_get', {id, workspaceId}],
        success: (response, dispatch) => {
          dispatch(actions.loadLog(response))
        }
      }
    })
  } else {
    dispatch(actions.loadLog(id, workspaceId, {}))
  }
}

actions.getChartData = (workspaceId, queryString) => (dispatch) => {
  dispatch(actions.loadChartData({}))
  if(workspaceId) {
    dispatch({
      [API_REQUEST]: {
        url: generateUrl('apiv2_workspace_tool_logs_list_chart', {workspaceId}) + queryString,
        success: (response, dispatch) => {
          dispatch(actions.loadChartData(response))
        }
      }
    })
  }
}