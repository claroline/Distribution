import invariant from 'invariant'

export const REQUEST_SEND     = 'REQUEST_SEND'
export const RESPONSE_RECEIVE = 'RECEIVE_RESPONSE'

export const REQUESTS_INCREMENT = 'REQUESTS_INCREMENT'
export const REQUESTS_DECREMENT = 'REQUESTS_DECREMENT'

export const actions = {}

actions.incrementRequests = makeActionCreator(REQUESTS_INCREMENT)
actions.decrementRequests = makeActionCreator(REQUESTS_DECREMENT)

actions.receiveResponse = makeActionCreator(RESPONSE_RECEIVE, 'response')


// generator for very simple action creators (see redux doc)
export function makeActionCreator(type, ...argNames) {
  return (...args) => {
    let action = { type }
    argNames.forEach((arg, index) => {
      invariant(args[index] !== undefined, `${argNames[index]} is required`)
      action[argNames[index]] = args[index]
    })
    return action
  }
}
