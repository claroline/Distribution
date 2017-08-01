import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {reducer as modalReducer}    from '#/main/core/layout/modal/reducer'
import {reducer as resourceReducer} from '#/main/core/layout/resource/reducer'

const initialState = {
  resourceNode: {},
  config: {
    serverUrl: null,
    securitySalt: null
  },
  modal: {}
}

const mainReducers = {}

export const reducers = combineReducers({
  resourceNode: resourceReducer,
  config: makeReducer(initialState['config'], mainReducers),
  modal: modalReducer
})