import cloneDeep from 'lodash/cloneDeep'
import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {VIEW_USER} from './views'
import {makeListReducer} from '#/main/core/layout/list/reducer'
import {reducer as paginationReducer} from '#/main/core/layout/pagination/reducer'
import {SESSION_EVENTS_LOAD, EVENT_FORM_RESET, EVENT_FORM_UPDATE} from './actions'

const initialState = {
  workspaceId: null,
  canEdit: 0,
  sessions: {},
  sessionId: null,
  events: {},
  mode: VIEW_USER,
  eventForm: {
    id: null,
    name: null,
    description: null,
    startDate: null,
    endDate: null,
    registrationType: 0,
    maxUsers: null
  }
}

const handlers2 = {

}

const handlers = {
  [SESSION_EVENTS_LOAD]: (state, action) => {
    return {
      data: action.sessionEvents,
      totalResults: action.total
    }
  }
}

const eventFormHandlers = {
  [EVENT_FORM_RESET]: () => initialState['eventForm'],
  [EVENT_FORM_UPDATE]: (event, action) => {
    const newEvent = cloneDeep(event)
    newEvent[action.property] = action.value

    return newEvent
  }
}

export const reducers = combineReducers({
  workspaceId: makeReducer(initialState['workspaceId'], handlers2),
  canEdit: makeReducer(initialState['canEdit'], handlers2),
  sessions: makeReducer(initialState['sessions'], handlers2),
  sessionId: makeReducer(initialState['sessionId'], handlers2),
  events: makeReducer(initialState['events'], handlers),
  mode: makeReducer(initialState['mode'], handlers2),
  eventForm: makeReducer(initialState['eventForm'], eventFormHandlers),
  list: makeListReducer(),
  pagination: paginationReducer
})