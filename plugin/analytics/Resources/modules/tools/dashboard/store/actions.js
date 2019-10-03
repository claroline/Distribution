import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST, url} from '#/main/app/api'
import {actions as listActions} from '#/main/app/content/list/store'

import {selectors} from '#/plugin/analytics/tools/dashboard/store/selectors'

const LOAD_DASHBOARD = 'LOAD_DASHBOARD'
const LOAD_ANALYTICS = 'LOAD_ANALYTICS'

const actions = {}

actions.loadDashboard = makeActionCreator(LOAD_DASHBOARD, 'data')
actions.loadAnalytics = makeActionCreator(LOAD_ANALYTICS, 'data')

actions.getDashboardData = (route, params = {}, queryString = '') => (dispatch) => {
  dispatch(actions.loadDashboard({}))
  if (route) {
    dispatch({
      [API_REQUEST]: {
        url: url([route, params]) + queryString,
        success: (response, dispatch) => {
          dispatch(actions.loadDashboard(response))
        },
        error: (err, status, dispatch) => {
          dispatch(actions.loadDashboard({}))
        }
      }
    })
  }
}

actions.getAnalyticsData = (route, params = {}, queryString = '') => (dispatch) => {
  dispatch(actions.loadAnalytics({}))

  if (route) {
    dispatch({
      [API_REQUEST]: {
        url: url([route, params]) + queryString,
        success: (response, dispatch) => dispatch(actions.loadAnalytics(response)),
        error: (err, status, dispatch) => dispatch(actions.loadAnalytics({}))
      }
    })
  }
}

actions.createRequirementsForRoles = (workspace, roles) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: url(['apiv2_workspace_requirements_roles_create', {workspace: workspace.uuid}], {ids: roles.map(r => r.id)}),
      request: {
        method: 'PUT'
      },
      success: (response, dispatch) => dispatch(listActions.invalidateData(selectors.STORE_NAME + '.requirements.roles'))
    }
  })
}

actions.createRequirementsForUsers = (workspace, users) => (dispatch) => {
  dispatch({
    [API_REQUEST]: {
      url: url(['apiv2_workspace_requirements_users_create', {workspace: workspace.uuid}], {ids: users.map(u => u.id)}),
      request: {
        method: 'PUT'
      },
      success: (response, dispatch) => dispatch(listActions.invalidateData(selectors.STORE_NAME + '.requirements.users'))
    }
  })
}

export {
  actions,
  LOAD_DASHBOARD,
  LOAD_ANALYTICS
}
