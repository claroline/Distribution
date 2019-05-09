import {createSelector} from 'reselect'

const STORE_NAME = 'tool'

const store = (state) => state[STORE_NAME]

const loaded = createSelector(
  [store],
  (store) => store.loaded
)

const name = createSelector(
  [store],
  (store) => store.name
)

const icon = createSelector(
  [store],
  (store) => store.icon
)

const context = createSelector(
  [store],
  (store) => store.currentContext
)

const contextType = createSelector(
  [context],
  (context) => context.type
)

const contextData = createSelector(
  [context],
  (context) => context.data
)

export const selectors = {
  STORE_NAME,
  store,
  loaded,
  name,
  icon,
  context,
  contextType,
  contextData
}
