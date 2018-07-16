import {actions as formActions} from '#/main/core/data/form/actions'

export const UPDATE_DELETED_TAB = 'UPDATE_DELETED_TABS'
export const UPDATE_DELETED_WIDGET = 'UPDATE_DELETED_WIDGET'
export const actions = {}

actions.deleteTab = (currentTabIndex, tabs, push) => (dispatch) => {

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
