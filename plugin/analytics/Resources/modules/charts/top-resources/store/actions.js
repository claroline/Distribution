import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const TOP_RESOURCES_LOAD = 'TOP_RESOURCES_LOAD'

export const actions = {}

actions.loadTop = makeActionCreator(TOP_RESOURCES_LOAD, 'data')

actions.fetchTop = () => ({
  [API_REQUEST]: ({
    url: ['apiv2_admin_tool_analytics_top_resources'],
    success: (response, dispatch) => dispatch(actions.loadTop(response))
  })
})