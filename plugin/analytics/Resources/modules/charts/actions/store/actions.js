import {makeActionCreator} from '#/main/app/store/actions'

import {API_REQUEST} from '#/main/app/api'

export const ACTIONS_CHART_LOAD = 'ACTIONS_CHART_LOAD'

export const actions = {}

actions.loadActions = makeActionCreator(ACTIONS_CHART_LOAD, 'data')
actions.fetchActions = () => ({
  [API_REQUEST]: {
    url: ['apiv2_admin_tool_analytics_actions'],
    success: (response, dispatch) => dispatch(actions.loadActions(response))
  }
})
