import {makeReducer} from './../../utils/reducers'

import {
  SEARCH_ADD_FILTER,
  SEARCH_REMOVE_FILTER,
  SEARCH_CLEAR
} from './../actions/search'

function addSearchFilter(searchState, action = {}) {

}

function removeSearchFilter(searchState, action = {}) {

}

function clearFilter(searchState, action = {}) {

}

const searchReducer = makeReducer([], {
  [SEARCH_ADD_FILTER]: addSearchFilter,
  [SEARCH_REMOVE_FILTER]: removeSearchFilter,
  [SEARCH_CLEAR]: clearFilter
})

export default searchReducer