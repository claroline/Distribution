import {createSelector} from 'reselect'

const STORE_NAME = 'resource_manager'

const store = (state) => state[STORE_NAME]

const root = createSelector(
  [store],
  (store) => store.root
)

export const selectors = {
  STORE_NAME,

  store,
  root
}
