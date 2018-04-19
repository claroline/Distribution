import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/api/router'

export const LOAD_OVERVIEW = 'LOAD_OVERVIEW'
export const LOAD_AUDIENCE = 'LOAD_AUDIENCE'
export const LOAD_RESOURCES = 'LOAD_RESOURCES'
export const LOAD_WIDGETS = 'LOAD_WIDGETS'
export const LOAD_TOP_ACTIONS = 'LOAD_TOP_ACTIONS'

export const actions = {}

actions.loadOverviewData = makeActionCreator(LOAD_OVERVIEW, 'data')
actions.loadAudienceData = makeActionCreator(LOAD_AUDIENCE, 'data')
actions.loadResourcesData = makeActionCreator(LOAD_RESOURCES, 'data')
actions.loadWidgetsData = makeActionCreator(LOAD_WIDGETS, 'data')
actions.loadTopActionsData = makeActionCreator(LOAD_TOP_ACTIONS, 'data')

actions.getOverviewData = () => (dispatch) => {
  actions.loadOverviewData({})
  dispatch({
    [API_REQUEST]: {
      url: generateUrl('apiv2_admin_tool_analytics_overview'),
      success: (response, dispatch) => {
        dispatch(actions.loadOverviewData(response))
      }
    }
  })
}

actions.getAudienceData = () => (dispatch) => {
  actions.loadAudienceData({})
  dispatch({
    [API_REQUEST]: {
      url: generateUrl('apiv2_admin_tool_analytics_audience'),
      success: (response, dispatch) => {
        dispatch(actions.loadAudienceData(response))
      }
    }
  })
}

actions.getResourcesData = () => (dispatch) => {
  actions.loadResourcesData({})
  dispatch({
    [API_REQUEST]: {
      url: generateUrl('apiv2_admin_tool_analytics_resources'),
      success: (response, dispatch) => {
        dispatch(actions.loadResourcesData(response))
      }
    }
  })
}

actions.getWidgetsData = () => (dispatch) => {
  actions.loadWidgetsData({})
  dispatch({
    [API_REQUEST]: {
      url: generateUrl('apiv2_admin_tool_analytics_widgets'),
      success: (response, dispatch) => {
        dispatch(actions.loadWidgetsData(response))
      }
    }
  })
}

actions.getTopActionsData = () => (dispatch) => {
  actions.loadTopActionsData({})
  dispatch({
    [API_REQUEST]: {
      url: generateUrl('apiv2_admin_tool_analytics_top_actions'),
      success: (response, dispatch) => {
        dispatch(actions.loadTopActionsData(response))
      }
    }
  })
}