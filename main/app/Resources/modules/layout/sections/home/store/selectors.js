import {createSelector} from 'reselect'

import {selectors as configSelectors} from '#/main/app/config/store/selectors'

import {constants} from '#/main/app/layout/sections/home/constants'

const home = createSelector(
  [configSelectors.config],
  (store) => store.home
)

const homeType = createSelector(
  [home],
  (home) => home.type || constants.HOME_TYPE_NONE
)

const hasHome = createSelector(
  [homeType],
  (homeType) => homeType && constants.HOME_TYPE_NONE !== homeType
)

// either the html content or a redirect URL
const homeData = createSelector(
  [home],
  (home) => home.data
)

export const selectors = {
  homeType,
  homeData,
  hasHome
}
