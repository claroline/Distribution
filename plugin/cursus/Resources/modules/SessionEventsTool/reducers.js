import cloneDeep from 'lodash/cloneDeep'
import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {VIEW_USER} from './views'
import {makeListReducer} from '#/main/core/layout/list/reducer'
import {reducer as paginationReducer} from '#/main/core/layout/pagination/reducer'
import {SESSION_EVENTS_LOAD, SESSION_EVENT_ADD, EVENT_FORM_RESET, EVENT_FORM_UPDATE} from './actions'

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

const handlers = {

}

const eventsHandlers = {
  [SESSION_EVENTS_LOAD]: (state, action) => {
    return {
      data: action.sessionEvents,
      totalResults: action.total
    }
  },
  [SESSION_EVENT_ADD]: (state, action) => {
    const events = cloneDeep(state.data)
    events.push(action.sessionEvent)

    return {
      data: events,
      totalResults: state.totalResults + 1
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
  workspaceId: makeReducer(initialState['workspaceId'], handlers),
  canEdit: makeReducer(initialState['canEdit'], handlers),
  sessions: makeReducer(initialState['sessions'], handlers),
  sessionId: makeReducer(initialState['sessionId'], handlers),
  events: makeReducer(initialState['events'], eventsHandlers),
  mode: makeReducer(initialState['mode'], handlers),
  eventForm: makeReducer(initialState['eventForm'], eventFormHandlers),
  list: makeListReducer(),
  pagination: paginationReducer
})