import cloneDeep from 'lodash/cloneDeep'
import {makeReducer} from '#/main/core/utilities/redux'
import {
  CONFIGURATION_UPDATE,
  CONFIGURATION_MESSAGE_RESET,
  CONFIGURATION_MESSAGE_UPDATE
} from './actions'

const initialState = {
  serverUrl: null,
  securitySalt: null,
  message: {
    content: null,
    type: 'info'
  }
}

const mainReducers = {
  [CONFIGURATION_UPDATE]: (state, action) => {
    const newState = cloneDeep(state)
    newState[action.property] = action.value

    return newState
  },
  [CONFIGURATION_MESSAGE_RESET]: (state) => {
    const newState = cloneDeep(state)
    newState.message = initialState.message

    return newState
  },
  [CONFIGURATION_MESSAGE_UPDATE]: (state, action) => {
    const newState = cloneDeep(state)
    newState.message = {
      content: action.content,
      type: action.status
    }

    return newState
  }
}

export const reducers = makeReducer(initialState, mainReducers)