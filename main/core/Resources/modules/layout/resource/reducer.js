import merge from 'lodash/merge'

import {makeReducer} from '#/main/core/utilities/redux'
import {
  RESOURCE_PUBLICATION_TOGGLE,
  RESOURCE_UPDATE_PROPERTIES
} from './actions'

function togglePublication(currentState) {
  return updateProperties(currentState, {
    meta: {
      published: !currentState.meta.published
    }
  })
}

function updateProperties(currentState, action) {
  return merge({}, currentState, action.resourceNode)
}

const reducer = makeReducer({}, {
  [RESOURCE_PUBLICATION_TOGGLE]: togglePublication,
  [RESOURCE_UPDATE_PROPERTIES]: updateProperties
})

export {reducer}
