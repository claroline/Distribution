import {createSelector} from 'reselect'

const groups = state => state.groups

const data = createSelector(
  [groups],
  (groups) => groups.data
)

const totalResults = createSelector(
  [groups],
  (groups) => groups.totalResults
)

export const select = {
  groups,
  data,
  totalResults
}
