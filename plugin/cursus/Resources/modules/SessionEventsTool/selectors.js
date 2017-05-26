import {createSelector} from 'reselect'

const events = state => state.events

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
  eventFormData
}