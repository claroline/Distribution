import {makeReducer} from './../../utils/reducers'

import {
  SEARCH_CHANGE_FILTERS,
  SEARCH_CLEAR_FILTERS
} from './../actions/search'

function changeFilters(state, action) {
  return action.filters
}

function clearFilters() {
  return {}
}

const searchReducer = makeReducer({}, {
  [SEARCH_CHANGE_FILTERS]: changeFilters,
  [SEARCH_CLEAR_FILTERS]: clearFilters
})

export default searchReducer
