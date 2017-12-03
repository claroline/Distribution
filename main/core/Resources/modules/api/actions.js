import {makeActionCreator} from '#/main/core/utilities/redux/actions'

// TODO : add public file upload here (see quiz objects upload)

export const API_REQUEST = 'API_REQUEST'

export const REQUEST_SEND     = 'REQUEST_SEND'
export const RESPONSE_RECEIVE = 'RESPONSE_RECEIVE'

export const actions = {}

actions.sendRequest = makeActionCreator(REQUEST_SEND, 'apiRequest')
actions.receiveResponse = makeActionCreator(RESPONSE_RECEIVE, 'apiRequest', 'response')
