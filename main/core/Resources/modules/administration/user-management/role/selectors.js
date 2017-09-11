import {createSelector} from 'reselect'

const roles = state => state.roles

const data = createSelector(
  [roles],
  (roles) => roles.data
)

const totalResults = createSelector(
  [roles],
  (roles) => roles.totalResults
)

export const select = {
  roles,
  data,
  totalResults
}
