import {makeReducer} from '#/main/core/utilities/redux'

const initialState = {
  resourceNode: {},
  serverUrl: null,
  securityKey: null
}

const mainReducers = {}

export const reducers = makeReducer(initialState, mainReducers)