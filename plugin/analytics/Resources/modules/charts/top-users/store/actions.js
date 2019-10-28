import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const TOP_USERS_LOAD = 'TOP_USERS_LOAD'

export const actions = {}

actions.loadTop = makeActionCreator(TOP_USERS_LOAD, 'data')

actions.fetchTop = () => ({
  [API_REQUEST]: ({
    url: ['apiv2_admin_tool_analytics_top_users'],
    success: (response, dispatch) => dispatch(actions.loadTop(response))
  })
})