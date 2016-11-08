import {createSelector} from 'reselect'

const getSortBy = (state) => state.sortBy

export const getPropertySortDirection =  createSelector(
  [property, getSortBy],
  (property, sortBy) => {
    return property === sortBy.property ? sortBy.direction : 0
  }
)