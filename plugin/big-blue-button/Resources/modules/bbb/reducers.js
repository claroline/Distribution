import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {reducer as modalReducer}    from '#/main/core/layout/modal/reducer'
import {reducer as resourceNodeReducer} from '#/main/core/layout/resource/reducer'
import {BBB_URL_UPDATE} from './actions'

const initialState = {
  user: {},
  resource: {},
  resourceNode: {},
  config: {
    serverUrl: null,
    securityKey: null
  },
  canEdit: false,
  bbbUrl: null,
  modal: {}
}

const bbbReducers = {
  [BBB_URL_UPDATE]: (state, action) => action.url
}

const resourceReducers = {}

const mainReducers = {}

export const reducers = combineReducers({
  user: makeReducer(initialState['user'], mainReducers),
  resource: makeReducer(initialState['resource'], resourceReducers),
  resourceNode: resourceNodeReducer,
  config: makeReducer(initialState['config'], mainReducers),
  canEdit: makeReducer(initialState['canEdit'], mainReducers),
  bbbUrl: makeReducer(initialState['bbbUrl'], bbbReducers),
  modal: modalReducer
})