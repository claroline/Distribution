import {createSelector} from 'reselect'

import {selectors as dashboardSelectors} from '#/main/core/tools/dashboard/store/selectors'

const store = (state) => state[dashboardSelectors.STORE_NAME]

const path = createSelector(
  [store],
  (store) => store.path
)

const trackings = createSelector(
  [path],
  (path) => path.trackings
)

export const selectors = {
  path,
  trackings
}
