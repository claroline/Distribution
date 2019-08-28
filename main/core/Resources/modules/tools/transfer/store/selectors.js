import {createSelector} from 'reselect'

const STORE_NAME = 'transfer'

const store = (state) => state[STORE_NAME]

const explanation = createSelector(
  [store],
  (store) => store.explanation
)

const log = createSelector(
  [store],
  (store) => store.log
)

export const selectors = {
  STORE_NAME,
  store,
  explanation,
  log
}
