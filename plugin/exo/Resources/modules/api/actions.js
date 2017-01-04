import {makeActionCreator} from './../utils/actions'

export const REQUEST_SEND     = 'REQUEST_SEND'
export const RESPONSE_RECEIVE = 'RESPONSE_RECEIVE'

export const actions = {}

actions.sendRequest = makeActionCreator(REQUEST_SEND)
actions.receiveResponse = makeActionCreator(RESPONSE_RECEIVE)
