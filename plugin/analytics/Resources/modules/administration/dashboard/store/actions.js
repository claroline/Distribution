import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

const LOAD_AUDIENCE = 'LOAD_AUDIENCE'

const actions = {}

actions.loadAudienceData = makeActionCreator(LOAD_AUDIENCE, 'data')

actions.getAudienceData = (filters = {}) => (dispatch) => {
  actions.loadAudienceData({})
  if (Object.keys(filters).length !== 0) {
    filters = {filters: filters}
  }
  dispatch({
    [API_REQUEST]: {
      url: ['apiv2_admin_tool_analytics_audience', filters],
      success: (response, dispatch) => {
        dispatch(actions.loadAudienceData(response))
      }
    }
  })
}

export {
  actions,
  LOAD_AUDIENCE
}
