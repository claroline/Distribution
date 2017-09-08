import {createSelector} from 'reselect'

const users = state => state.users

const data = createSelector(
  [users],
  (users) => users.data
)

const totalResults = createSelector(
  [users],
  (users) => users.totalResults
)

export const select = {
  users,
  data,
  totalResults
}
