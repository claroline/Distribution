import {selectors as select} from '#/main/core/tools/users/store/selectors'
import {createSelector} from 'reselect'

const store = (state) => state[select.STORE_NAME]
const FORM_NAME = select.STORE_NAME + '.user'

const facets = createSelector(
  [store],
  (store) => {
    return store.facets
  }
)

const currentFacet = createSelector(
  [store],
  (store) => store.facets.find(facet => facet.id === store.currentFacet) || {}
)

const parameters = createSelector(
  [store],
  (store) => store.parameters
)

export const selectors = {
  facets,
  currentFacet,
  parameters,
  FORM_NAME
}
