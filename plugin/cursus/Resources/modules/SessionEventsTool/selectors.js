import {createSelector} from 'reselect'

const sessions = state => state.sessions
const sessionId = state => state.sessionId
const events = state => state.events

const currentSession = createSelector(
  [sessions, sessionId],
  (sessions, sessionId) => sessions.find(s => s.id === sessionId)
)

const sessionEvents = createSelector(
  [events],
  (events) => events.data
)

const sessionEventsTotal = createSelector(
  [events],
  (events) => events.totalResults
)

const eventFormData = state => state.eventForm

export const selectors = {
  sessionEvents,
  sessionEventsTotal,
  eventFormData,
  currentSession
}