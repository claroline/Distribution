import cloneDeep from 'lodash/cloneDeep'

import {makeReducer, combineReducers} from '#/main/core/utilities/redux'

import {
  LIST_FILTER_ADD,
  LIST_FILTER_REMOVE,
  LIST_SORT_UPDATE
} from '#/main/core/layout/list/actions'

function addFilter(state, action = {}) {
  const newFilters = cloneDeep(state.filters)

  const existingFilter = newFilters.find(filter => filter.property === action.property)
  if (existingFilter) {
    existingFilter.value = action.value
  } else {
    newFilters.push({
      property: action.property,
      value: action.value
    })
  }

  return Object.assign({}, state, {
    filters: newFilters
  })
}

function removeFilter(state, action = {}) {
  const newFilters = state.filters.slice(0);
  const pos = state.filters.indexOf(action.filter)
  if (-1 !== pos) {
    newFilters.splice(pos, 1);
  }

  return Object.assign({}, state, {
    filters: newFilters
  })
}

function updateSort(state, action = {}) {
  let direction = 1
  if (state.sortBy.property === action.property) {
    if (1 === state.sortBy.direction) {
      direction = -1
    } else if (-1 === state.sortBy.direction) {
      direction = 0
    }
    else {
      direction = 1
    }
  }

  return Object.assign({}, state, {
    sortBy: {
      property: action.property,
      direction: direction
    }
  })
}

const reducer = makeReducer({
  filters: [],
  sortBy: {
    property: null,
    direction: 0
  }
}, {
  [LIST_FILTER_ADD]: addFilter,
  [LIST_FILTER_REMOVE]: removeFilter,
  [LIST_SORT_UPDATE]: updateSort
})

export {reducer}
