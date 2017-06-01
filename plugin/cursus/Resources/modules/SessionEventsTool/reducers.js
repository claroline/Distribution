import cloneDeep from 'lodash/cloneDeep'
import {makeReducer, combineReducers} from '#/main/core/utilities/redux'
import {VIEW_USER} from './enums'
import {makeListReducer} from '#/main/core/layout/list/reducer'
import {reducer as paginationReducer} from '#/main/core/layout/pagination/reducer'
import {
  SESSION_EVENTS_LOAD,
  SESSION_EVENT_LOAD,
  SESSION_EVENT_ADD,
  SESSION_EVENT_UPDATE,
  EVENT_FORM_RESET,
  EVENT_FORM_UPDATE,
  EVENT_FORM_LOAD,
  UPDATE_VIEW_MODE
} from './actions'

const initialState = {
  workspaceId: null,
  canEdit: 0,
  sessions: {},
  sessionId: null,
  currentEvent: {},
  events: {},
  viewMode: VIEW_USER,
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

const mainReducers = {}

const currentEventReducers = {
  [SESSION_EVENT_LOAD]: (state, action) => {
    return action.sessionEvent
  }
}

const eventsReducers = {
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
  },
  [SESSION_EVENT_UPDATE]: (state, action) => {
    const events = state.data.map((event) => {
      if (event.id === action.sessionEvent.id) {
        return action.sessionEvent
      } else {
        return event
      }
    })

    return {
      data: events,
      totalResults: state.totalResults
    }
  }
}

const eventFormReducers = {
  [EVENT_FORM_RESET]: () => initialState['eventForm'],
  [EVENT_FORM_UPDATE]: (event, action) => {
    const newEvent = cloneDeep(event)
    newEvent[action.property] = action.value

    return newEvent
  },
  [EVENT_FORM_LOAD]: (state, action) => {
    return action.event
  }
}

const viewReducers = {
  [UPDATE_VIEW_MODE]: (state, action) => {
    return action.mode
  }
}

export const reducers = combineReducers({
  workspaceId: makeReducer(initialState['workspaceId'], mainReducers),
  canEdit: makeReducer(initialState['canEdit'], mainReducers),
  sessions: makeReducer(initialState['sessions'], mainReducers),
  sessionId: makeReducer(initialState['sessionId'], mainReducers),
  currentEvent: makeReducer(initialState['currentEvent'], currentEventReducers),
  events: makeReducer(initialState['events'], eventsReducers),
  viewMode: makeReducer(initialState['viewMode'], viewReducers),
  eventForm: makeReducer(initialState['eventForm'], eventFormReducers),
  list: makeListReducer(),
  pagination: paginationReducer
})