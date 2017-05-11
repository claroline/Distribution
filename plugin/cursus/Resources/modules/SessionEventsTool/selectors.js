import {createSelector} from 'reselect'

const sessionId = state => state.sessionId
const events =  state => state.events
const sessionEvents = createSelector(
  events,
  sessionId,
  (events, sessionId) => {
    return sessionId ? events[sessionId] : []
  }
)

export const selectors = {
  sessionEvents
}