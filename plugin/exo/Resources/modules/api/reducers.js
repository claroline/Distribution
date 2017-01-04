import {makeReducer} from './../utils/reducers'

import {
  REQUEST_SEND,
  RESPONSE_RECEIVE
} from './actions'

function incrementRequests(state) {
  return state + 1
}

function decrementRequests(state) {
  return state - 1
}

export const reducers = {
  currentRequests: makeReducer(0, {
    [REQUEST_SEND]: incrementRequests,
    [RESPONSE_RECEIVE]: decrementRequests
  })
}
