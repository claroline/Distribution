import {makeReducer} from './../utils/reducers'

import {
  REQUESTS_INCREMENT,
  REQUESTS_DECREMENT
} from './actions'

function incrementRequests(state) {
  return state + 1
}

function decrementRequests(state) {
  return state - 1
}

export const reducers = {
  currentRequests: makeReducer(0, {
    [REQUESTS_INCREMENT]: incrementRequests,
    [REQUESTS_DECREMENT]: decrementRequests
  })
}
