import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {VIEW_USER} from './views'

const initialState = {
  workspaceId: null,
  canEdit: 0,
  sessions: {},
  sessionId: null,
  events: {},
  mode: VIEW_USER
}

const handlers = {
}

export const reducers = combineReducers({
  workspaceId: makeReducer(initialState['workspaceId'], handlers),
  canEdit: makeReducer(initialState['canEdit'], handlers),
  sessions: makeReducer(initialState['sessions'], handlers),
  sessionId: makeReducer(initialState['sessionId'], handlers),
  events: makeReducer(initialState['events'], handlers),
  mode: makeReducer(initialState['mode'], handlers)
})