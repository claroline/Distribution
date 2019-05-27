import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

export const LOAD_MODEL = 'LOAD_MODEL'
export const LOAD_CURRENT = 'LOAD_CURRENT'
export const LOG_REFRESH = 'LOG_REFRESH'
export const LOAD_ARCHIVE = 'LOAD_ARCHIVE'
export const FETCH_ARCHIVE = 'FETCH_ARCHIVE'

export const actions = {}

actions.loadModel = makeActionCreator(LOAD_MODEL, 'data')
actions.loadCurrent = makeActionCreator(LOAD_CURRENT, 'data')
actions.loadArchive = makeActionCreator(LOAD_ARCHIVE, 'data')
actions.fetchArchive = makeActionCreator(FETCH_ARCHIVE, 'data')

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

actions.fetchArchive = (url) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_archive_fetch'],
    request: {
      method: 'POST',
      body: JSON.stringify({url})
    },
    success: (response, dispatch) => {
      dispatch(actions.loadArchive(response))
    }
  }
})

actions.copyBase = (modelId, data) => ({
  [API_REQUEST]: {
    url: ['apiv2_workspace_copy_base', {workspace: modelId}],
    request: {
      body: JSON.stringify(data),
      method: 'POST'
    },
    success: (response, dispatch) => {
      dispatch(actions.loadCurrent(response))
    }
  }
})

// logs
actions.refresh = makeActionCreator(LOG_REFRESH, 'content')
actions.reset =  makeActionCreator(LOG_REFRESH)

actions.load = (file) => {
  return {
    [API_REQUEST]: {
      url: ['apiv2_logger_get', {subdir: 'workspace', name: file}],
      success: (response, dispatch) => {
        dispatch(actions.refresh(response))
      }
    }
  }
}
