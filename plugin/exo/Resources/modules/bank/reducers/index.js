import { combineReducers } from 'redux'

import questionsReducer    from './questions'
import totalResultsReducer from './total-results'

export const bankApp = combineReducers({
  data: questionsReducer,
  totalResults: totalResultsReducer
  //currentUser: (state = null) => state
})
