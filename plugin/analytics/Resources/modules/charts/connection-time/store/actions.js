import {makeActionCreator} from '#/main/app/store/actions'

import {API_REQUEST} from '#/main/app/api'

export const CONNECTION_TIME_CHART_LOAD = 'CONNECTION_TIME_CHART_LOAD'

export const actions = {}

actions.loadConnectionTime = makeActionCreator(CONNECTION_TIME_CHART_LOAD, 'data')
actions.fetchConnectionTime = () => ({
  [API_REQUEST]: {
    url: ['apiv2_admin_tool_analytics_time'],
    success: (response, dispatch) => dispatch(actions.loadConnectionTime(response))
  }
})
