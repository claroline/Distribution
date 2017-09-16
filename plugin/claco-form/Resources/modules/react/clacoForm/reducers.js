import cloneDeep from 'lodash/cloneDeep'
import {makeReducer} from '#/main/core/utilities/redux'
import {
  RESOURCE_PROPERTY_UPDATE,
  PARAMETERS_INITIALIZE,
  PARAMETERS_UPDATE
} from './actions'

const mainReducers = makeReducer({}, {})

const resourceReducers = makeReducer({}, {
  [RESOURCE_PROPERTY_UPDATE]: (state, action) => Object.assign({}, state, {[action.property]: action.value})
})

const parametersReducers = makeReducer({}, {
  [PARAMETERS_INITIALIZE]: (state, action) => action.params,
  [PARAMETERS_UPDATE]: (state, action) => {
    const parameters = cloneDeep(state)
    parameters[action.property] = action.value

    return parameters
  }
})

export {
  mainReducers,
  resourceReducers,
  parametersReducers
}