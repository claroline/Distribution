import {createSelector} from 'reselect'

const getTotalResults = (state) => state.pagination.totalResults
const getPageSize     = (state) => state.pagination.pageSize

export const countPages =  createSelector(
  [getTotalResults, getPageSize],
  (totalResults, pageSize) => {
    const rest = totalResults % pageSize
    const nbPages = (totalResults - rest) / pageSize

    return nbPages + (rest > 0 ? 1 : 0)
  }
)