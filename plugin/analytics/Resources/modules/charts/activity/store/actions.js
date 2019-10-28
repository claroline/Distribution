import {makeActionCreator} from '#/main/app/store/actions'

import {API_REQUEST} from '#/main/app/api'

export const ACTIVITY_CHART_LOAD = 'ACTIVITY_CHART_LOAD'

export const actions = {}

actions.loadActivity = makeActionCreator(ACTIVITY_CHART_LOAD, 'data')
actions.fetchActivity = () => ({
  [API_REQUEST]: {
    url: ['apiv2_admin_tool_analytics_activity'],
    success: (response, dispatch) => dispatch(actions.loadActivity(response))
  }
})
