import {API_REQUEST} from '#/main/app/api'
import {url} from '#/main/app/api/router'
import {actions as listActions} from '#/main/app/content/list/store/actions'

export const actions = {}

actions.restore = (nodes, workspace) => ({
  [API_REQUEST]: {
    url: url(['apiv2_resource_workspace_restore', {workspace: workspace.uuid}], {ids: nodes.map(node => node.id)}),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('resources'))
    }
  }
})
