import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'

import {selectors} from '#/main/core/resource/store/selectors'

// actions
export const RESOURCE_UPDATE_NODE   = 'RESOURCE_UPDATE_NODE'
export const USER_EVALUATION_UPDATE = 'USER_EVALUATION_UPDATE'
export const RESOURCE_LOAD          = 'RESOURCE_LOAD'
export const RESOURCE_RESTRICTIONS_DISMISS = 'RESOURCE_RESTRICTIONS_DISMISS'
export const RESOURCE_RESTRICTIONS_ERROR = 'RESOURCE_RESTRICTIONS_ERROR'
export const RESOURCE_RESTRICTIONS_UNLOCKED = 'RESOURCE_RESTRICTIONS_UNLOCKED'

// action creators
export const actions = {}

actions.setRestrictionsError = makeActionCreator(RESOURCE_RESTRICTIONS_ERROR, 'errors')
actions.unlockResource = makeActionCreator(RESOURCE_RESTRICTIONS_UNLOCKED)
actions.loadResource = makeActionCreator(RESOURCE_LOAD, 'resourceData')
actions.fetchResource = (resourceNode, embedded = false) => ({
  [API_REQUEST]: {
    url: ['claro_resource_load_embedded', {type: resourceNode.meta.type, id: resourceNode.id, embedded: embedded ? 1 : 0}],
    success: (response, dispatch) => dispatch(actions.loadResource(response)),
    error: (response, dispatch) => dispatch(actions.setRestrictionsError(response))
  }
})

actions.updateNode = makeActionCreator(RESOURCE_UPDATE_NODE, 'resourceNode')

actions.triggerLifecycleAction = (action) => (dispatch, getState) => {
  const lifecycleActions = selectors.resourceLifecycle(getState())

  // checks if the current resource implements the action
  if (lifecycleActions[action]) {
    // dispatch the implemented action with resourceNode as param (don't know if this is useful)
    return lifecycleActions[action](
      selectors.resourceNode(getState())
    )
  }
}

actions.updateUserEvaluation = makeActionCreator(USER_EVALUATION_UPDATE, 'userEvaluation')

actions.dismissRestrictions = makeActionCreator(RESOURCE_RESTRICTIONS_DISMISS)

actions.checkAccessCode = (resourceNode, code, embedded = false) => ({
  [API_REQUEST] : {
    url: ['claro_resource_unlock', {id: resourceNode.id}],
    request: {
      method: 'POST',
      body: JSON.stringify({code: code})
    },
    success: (response, dispatch) => {
      dispatch(actions.unlockResource())
      dispatch(actions.fetchResource(resourceNode, embedded))
    },
    error: (response, dispatch) => dispatch(actions.fetchResource(resourceNode, embedded))
  }
})
