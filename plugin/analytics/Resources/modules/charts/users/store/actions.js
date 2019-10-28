import {makeActionCreator} from '#/main/app/store/actions'

import {API_REQUEST} from '#/main/app/api'

export const USERS_CHART_LOAD = 'USERS_CHART_LOAD'
export const USERS_CHART_CHANGE_MODE = 'USERS_CHART_CHANGE_MODE'

export const actions = {}

actions.changeMode = makeActionCreator(USERS_CHART_CHANGE_MODE, 'mode')

actions.loadUsers = makeActionCreator(USERS_CHART_LOAD, 'data')
actions.fetchUsers = () => ({
  [API_REQUEST]: {
    url: ['apiv2_admin_tool_analytics_users'],
    success: (response, dispatch) => dispatch(actions.loadUsers(response))
  }
})
