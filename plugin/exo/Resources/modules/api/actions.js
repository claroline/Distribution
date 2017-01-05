import { makeActionCreator } from './../utils/actions'

export const REQUEST_SEND     = 'REQUEST_SEND'
export const RESPONSE_RECEIVE = 'RESPONSE_RECEIVE'
export const RESPONSE_RECEIVE_FAILURE = 'RESPONSE_RECEIVE_FAILURE'
export const RESPONSE_RECEIVE_SUCCESS = 'RESPONSE_RECEIVE_SUCCESS'

export const REQUESTS_INCREMENT = 'REQUESTS_INCREMENT'
export const REQUESTS_DECREMENT = 'REQUESTS_DECREMENT'

export const actions = {}

actions.sendRequest = (target, request = {}) => {
  return {
    type: REQUEST_SEND,
    target,
    request
  }
}

actions.receiveResponse = makeActionCreator(RESPONSE_RECEIVE)

actions.incrementRequests = makeActionCreator(REQUESTS_INCREMENT)
actions.decrementRequests = makeActionCreator(REQUESTS_DECREMENT)

actions.receiveSuccessResponse = makeActionCreator(RESPONSE_RECEIVE_SUCCESS, 'responseData')
actions.receiveFailureResponse = makeActionCreator(RESPONSE_RECEIVE_FAILURE, 'error')
