import {createSelector} from 'reselect'

const STORE_NAME = 'dashboard'

const store = (state) => state[STORE_NAME]

const log = createSelector(
  [store],
  (store) => store.log
)

const chart = createSelector(
  [store],
  (store) => store.chart
)

const audience = createSelector(
  [store],
  (store) => store.audience
)

const widgets = createSelector(
  [store],
  (store) => store.widgets
)

const topActions = createSelector(
  [store],
  (store) => store.topActions
)

const connections = createSelector(
  [store],
  (store) => store.connections
)

export const selectors = {
  STORE_NAME,
  store,
  log,
  chart,
  audience,
  widgets,
  topActions,
  connections
}
