import {url} from '#/main/app/api'
import {API_REQUEST} from '#/main/app/api'

import {actions as listActions} from '#/main/core/data/list/actions'

export const actions = {}

actions.register = (workspaces) => ({
  [API_REQUEST]: {
    url: url(['apiv2_workspace_copy_bulk'], {}),
    request: {
      method: 'PUT'
    },
    success: (data, dispatch) => dispatch(listActions.invalidateData('workspaces.list'))
  }
})

actions.unregister = (workspaces) => ({
  [API_REQUEST]: {
    url: url(['apiv2_workspace_copy_bulk'], {}),
    request: {
      method: 'DELETE'
    },
    success: (data, dispatch) => dispatch(listActions.invalidateData('workspaces.list'))
  }
})
