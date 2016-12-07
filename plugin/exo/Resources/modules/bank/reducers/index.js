import { combineReducers } from 'redux'

import categoriesReducer      from './categories'
import questionsReducer       from './questions'
import currentQuestionReducer from './current-question'
import selectReducer          from './select'
import sortByReducer          from './sort-by'
import paginationReducer      from './pagination'
import searchReducer          from './search'

const bankApp = combineReducers({
  categories: categoriesReducer,
  questions: questionsReducer,
  selectedQuestions: selectReducer,
  currentQuestion: currentQuestionReducer,
  sortBy: sortByReducer,
  pagination: paginationReducer,
  search: searchReducer
})

export default bankApp