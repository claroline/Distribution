import {REQUEST_SEND} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/fos-js-router'
import {actions as listActions} from '#/main/core/layout/list/actions'

export const actions = {}

actions.enable = (user) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_user_update', {uuid: user.uuid}),
    request: {
      body: JSON.stringify({isEnabled: true, uuid: user.uuid}),
      method: 'PUT'
    },
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.disable = (user) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_user_update', {uuid: user.uuid}),
    request: {
      method: 'PUT',
      body: JSON.stringify({isEnabled: false, uuid: user.uuid})
    },
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.createWorkspace = (user) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_user_pws_create', {uuid: user.uuid}),
    request: { method: 'POST'},
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.deleteWorkspace = (user) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_user_pws_delete', {uuid: user.uuid}),
    request: {method: 'DELETE'},
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})
