import {createSelector} from 'reselect'

/**
 * Gets the whole pagination object
 *
 * @param {object} state
 */
const pagination = (state) => state.pagination

/**
 * Gets the current page size.
 */
const pageSize = createSelector(
  [pagination],
  (pagination) => pagination.pageSize || -1
)

/**
 * Gets the current page.
 */
const current = createSelector(
  [pagination],
  (pagination) => pagination.current || 0
)

/**
 * Builds the current pagination query string.
 */
const queryString = createSelector(
  [current, pageSize],
  (current, pageSize) => `page=${current}&limit=${pageSize}`
)

export const select = {
  pagination,
  pageSize,
  current,
  queryString
}
