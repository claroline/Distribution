import {createSelector} from 'reselect'

const scorm = state => state.scorm
const trackings = state => state.trackings
const summary = state => state.summary

const scos = createSelector(
  [scorm],
  (scorm) => scorm.scos
)

const summaryPinned = createSelector(
  [summary],
  (summary) => summary.pinned
)

const summaryOpened = createSelector(
  [summary],
  (summary) => summary.opened
)

export const select = {
  scorm,
  scos,
  trackings,
  summaryPinned,
  summaryOpened
}