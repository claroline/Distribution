import { combineReducers } from 'redux'

import {reduceModal}       from './../../modal/reducer'
import questionsReducer    from './questions'
import selectReducer       from './select'
import sortByReducer       from './sort-by'
import paginationReducer   from './pagination'
import searchReducer       from './search'
import totalResultsReducer from './total-results'

const bankApp = combineReducers({
  modal: reduceModal,
  questions: questionsReducer,
  selected: selectReducer,
  sortBy: sortByReducer,
  pagination: paginationReducer,
  search: searchReducer,
  totalResults: totalResultsReducer
})

export default bankApp
