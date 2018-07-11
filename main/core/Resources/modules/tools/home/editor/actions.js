import {makeActionCreator} from '#/main/core/scaffolding/actions'
import {API_REQUEST} from '#/main/core/api/actions'

export const UPDATE_DELETED_TAB = 'UPDATE_DELETED_TABS'
export const UPDATE_DELETED_WIDGET = 'UPDATE_DELETED_WIDGET'
export const actions = {}


actions.updateDeletedTab = makeActionCreator(UPDATE_DELETED_TAB, 'tabId')
actions.deleteTab = (tabId, push) => ({
  [API_REQUEST]: {
    url: ['apiv2_home_tab_delete_bulk', {ids: [tabId]}],
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateDeletedTab(tabId))
      push('/edit')
    }
  }
})

actions.updateDeletedWidget = makeActionCreator(UPDATE_DELETED_WIDGET, 'tabId', 'widgetId')
actions.deleteWidget = (tabId, widgetId) => ({
  [API_REQUEST]: {
    url: ['apiv2_widget_container_delete_bulk', {ids: [widgetId]}],
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => {
      dispatch(actions.updateDeletedWidget(tabId, widgetId))
      console.log(tabId, widgetId)
    }
  }
})
