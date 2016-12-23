import {makeActionCreator} from './../utils/actions'

export const REQUEST_SEND     = 'REQUEST_SEND'
export const RESPONSE_RECEIVE = 'RESPONSE_RECEIVE'
export const RESPONSE_SUCCESS = 'RESPONSE_SUCCESS'
export const RESPONSE_FAILURE = 'RESPONSE_FAILURE'

export const actions = {}

actions.sendRequest = makeActionCreator(REQUEST_SEND)
actions.receiveResponse = makeActionCreator(RESPONSE_RECEIVE)
