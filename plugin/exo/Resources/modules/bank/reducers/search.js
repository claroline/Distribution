import {makeReducer} from './../../utils/reducers'

import {
  SEARCH_ADD_FILTER,
  SEARCH_REMOVE_FILTER,
  SEARCH_CLEAR
} from './../actions/search'

function addSearchFilter() {

}

function removeSearchFilter() {

}

function clearFilter() {

}

const searchReducer = makeReducer([], {
  [SEARCH_ADD_FILTER]: addSearchFilter,
  [SEARCH_REMOVE_FILTER]: removeSearchFilter,
  [SEARCH_CLEAR]: clearFilter
})

export default searchReducer