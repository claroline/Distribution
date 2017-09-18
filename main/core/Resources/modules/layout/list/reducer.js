import cloneDeep from 'lodash/cloneDeep'
import merge from 'lodash/merge'

import {makeReducer, reduceReducers, combineReducers} from '#/main/core/utilities/redux'
import {reducer as paginationReducer} from '#/main/core/layout/pagination/reducer'

import {constants} from '#/main/core/layout/list/constants'
import {
  LIST_FILTER_ADD,
  LIST_FILTER_REMOVE,
  LIST_SORT_UPDATE,
  LIST_RESET_SELECT,
  LIST_TOGGLE_SELECT,
  LIST_TOGGLE_SELECT_ALL,
  LIST_DATA_LOAD
} from '#/main/core/layout/list/actions'

const fetchUrlReducer = (state = null) => state

const dataReducer = makeReducer([], {
  [LIST_DATA_LOAD]: (state, action = {}) => action.data
})

const totalResultsReducer = makeReducer(0, {
  [LIST_DATA_LOAD]: (state, action = {}) => action.total
})

const filterReducer = makeReducer([], {
  [LIST_FILTER_ADD]: (state, action = {}) => {
    const newFilters = cloneDeep(state)

    const existingFilter = newFilters.find(filter => filter.property === action.property)
    if (existingFilter) {
      existingFilter.value = action.value
    } else {
      newFilters.push({
        property: action.property,
        value: action.value
      })
    }

    return newFilters
  },

  [LIST_FILTER_REMOVE]: (state, action = {}) => {
    const newFilters = state.slice(0)
    const pos = state.indexOf(action.filter)
    if (-1 !== pos) {
      newFilters.splice(pos, 1)
    }

    return newFilters
  }
})

const sortReducer = makeReducer({property: null, direction: 0}, {
  [LIST_SORT_UPDATE]: (state, action = {}) => {
    let direction = 1
    if (state.property === action.property) {
      if (1 === state.direction) {
        direction = -1
      } else if (-1 === state.direction) {
        direction = 0
      }
      else {
        direction = 1
      }
    }

    return {
      property: action.property,
      direction: direction
    }
  }
})

// ATTENTION: we assume all data rows have an unique prop `id`.
const selectReducer = makeReducer([], {
  [LIST_RESET_SELECT]: () => {
    return []
  },

  [LIST_TOGGLE_SELECT]: (state, action = {}) => {
    const selected = state.slice(0)

    const itemPos = state.indexOf(action.row.id)
    if (-1 === itemPos) {
      // Item not selected
      selected.push(action.row.id)
    } else {
      // Item selected
      selected.splice(itemPos, 1)
    }

    return selected
  },

  [LIST_TOGGLE_SELECT_ALL]: (state, action = {}) => {
    return 0 < state.length ? [] : action.rows.map(row => row.id)
  }
})

/**
 * Creates reducers for lists.
 * It will register reducers for enabled features (eg. filtering, pagination)
 *
 * The `customReducers` param permits to pass reducers for specific list actions.
 * For now, `customReducers` can only have access to the `data` and `totalResults` stores.
 * `customReducers` are applied after the list ones.
 *
 * Example to add a custom reducer to `data`:
 *   customReducers = {
 *      data: myReducerFunc()
 *   }
 *
 * @param {object} customReducers - an object containing custom reducers.
 * @param {object} options        - an options object to disable/enable list features (default: DEFAULT_FEATURES).
 *
 * @returns {function}
 */
function makeListReducer(customReducers = {}, options = {}) {
  const reducer = {}
  const listOptions = merge({}, constants.DEFAULT_FEATURES, options)

  // adds base list reducers
  reducer.data = customReducers.data ?
    reduceReducers(dataReducer, customReducers.data) : dataReducer

  reducer.totalResults = customReducers.totalResults ?
    reduceReducers(totalResultsReducer, customReducers.totalResults) : totalResultsReducer

  // adds reducers for optional features when enabled
  if (listOptions.async) {
    reducer.fetchUrl = fetchUrlReducer
  }

  if (listOptions.filterable) {
    reducer.filters = filterReducer
  }

  if (listOptions.sortable) {
    reducer.sortBy = sortReducer
  }

  if (listOptions.selectable) {
    reducer.selected = selectReducer
  }

  if (listOptions.paginated) {
    reducer.pagination = paginationReducer
  }

  return combineReducers(reducer)
}

export {
  makeListReducer
}
