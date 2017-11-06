import {createSelector} from 'reselect'

const locations = state => state.locations

const data = createSelector(
  [locations],
  (locations) => groups.locations
)

const totalResults = createSelector(
  [locations],
  (locations) => groups.totalResults
)

export const select = {
  locations,
  data,
  totalResults
}
