import merge from 'lodash/merge'
import set from 'lodash/set'

import {makeReducer} from '#/main/core/utilities/redux'
import {
  RESOURCE_UPDATE_PUBLICATION,
  RESOURCE_UPDATE_NODE,
  RESOURCE_UNLOCK
} from './actions'

function togglePublication(currentState) {
  return merge({}, currentState, {
    meta: {
      published: !currentState.meta.published
    }
  })
}

function updateNode(currentState, action) {
  return merge({}, currentState, action.resourceNode)
}

function unlock(currentState, action) {
  set(currentState, 'isLocked', action.bool)

  return currentState
}

const reducer = makeReducer({}, {
  [RESOURCE_UPDATE_PUBLICATION]: togglePublication,
  [RESOURCE_UPDATE_NODE]: updateNode,
  [RESOURCE_UNLOCK]: unlock
})

export {reducer}
