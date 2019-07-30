import {createSelector} from 'reselect'

const STORE_NAME = 'users'

const store = (state) => state[STORE_NAME]

const restrictions = createSelector(
  [store],
  (store) => store.restrictions
)

const loaded = createSelector(
  [store],
  (store) => store.user.loaded
)

export const selectors = {
  STORE_NAME,
  store,
  loaded,
  restrictions
}
