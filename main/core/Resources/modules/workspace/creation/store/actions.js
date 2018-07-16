import {API_REQUEST} from '#/main/app/api'
import {makeActionCreator} from '#/main/app/store/actions'

export const LOAD_MODEL = 'LOAD_MODEL'

export const actions = {}

actions.loadModel = makeActionCreator(LOAD_MODEL, 'data')

actions.fetchModel = (model) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_get', {id: model}],
    request: {
      method: 'GET'
    },
    success: (response, dispatch) => {
      dispatch(actions.loadModel(response))
    }
  }
})

actions.copyBase = (modelId, data) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_copy_base', {workspace: modelId}],
    request: {
      body: JSON.stringify(data),
      method: 'POST'
    }
  }
})

actions.copyRoles = (newWorkspace, oldWorkspace) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_copy_roles', {new: newWorkspace.id, old: oldWorkspace.id}],
    request: {
      method: 'GET'
    }
  }
})

actions.copyBaseTools = (newWorkspace, oldWorkspace) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_copy_tools', {new: newWorkspace.id, old: oldWorkspace.id}],
    request: {
      method: 'GET'
    }
  }
})

actions.copyHome = (newWorkspace, oldWorkspace) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_copy_home', {new: newWorkspace.id, old: oldWorkspace.id}],
    request: {
      method: 'GET'
    }
  }
})

actions.copyResources = (newWorkspace, oldWorkspace) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_copy_resources', {new: newWorkspace.id, old: oldWorkspace.id}],
    request: {
      method: 'GET'
    }
  }
})
