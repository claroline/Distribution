import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/utilities/redux'

import {
  REQUEST_SEND,
  RECEIVE_RESPONSE
} from '#/main/core/api/actions'
import {constants as actionConstants} from '#/main/core/layout/action/constants'

import {
  ALERT_ADD,
  ALERT_REMOVE
} from './actions'
import {constants} from '#/main/core/layout/alert/constants'

const addAlert = (state, action) => {
  const newState = cloneDeep(state)

  const defaultAlert = constants.ALERT_ACTIONS[action.action][action.status]

  newState.push({
    id: action.id,
    status: action.status,
    action: action.action,
    message: action.message || defaultAlert.message,
    title: action.title || defaultAlert.title
  })

  return newState
}

const removeAlert = (state, action) => {
  console.log('remove alert')
  const newState = cloneDeep(state)

  const alertIndex = newState.findIndex(alert => action.id === alert.id)
  if (-1 !== alertIndex) {
    newState.splice(alertIndex, 1)
  }

  return newState
}

const reducer = makeReducer([], {
  // API alerts
  [REQUEST_SEND]: (state, action) => {
    if (!action.apiRequest.silent) {
      const currentAction = action.apiRequest.type || actionConstants.HTTP_ACTIONS[action.apiRequest.request.method]

      return addAlert(state, {
        id: action.apiRequest.id + constants.ALERT_STATUS_PENDING,
        status: constants.ALERT_STATUS_PENDING,
        action: currentAction,
        message: action.apiRequest.messages[constants.ALERT_STATUS_PENDING].message,
        title: action.apiRequest.messages[constants.ALERT_STATUS_PENDING].title
      })
    }

    return state
  },

  [RECEIVE_RESPONSE]: () => [],

  /*[RECEIVE_RESPONSE]: (state, action) => {
    console.log(state)
    console.log(action)
    if (!action.apiRequest.silent) {
      // remove pending alert
      const newState = removeAlert(state, {
        id: action.apiRequest.id + constants.ALERT_STATUS_PENDING
      })

      // add new status alert
      const currentAction = action.apiRequest.type || actionConstants.HTTP_ACTIONS[action.apiRequest.request.method]
      const currentStatus = constants.ALERT_ACTIONS[currentAction][action.response.status]
      if (currentStatus) {
        // the current action define a message for the status
        return addAlert(newState, {
          id: action.apiRequest.id + currentStatus,
          status: currentStatus,
          action: currentAction,
          message: action.apiRequest.messages[currentStatus].message,
          title: action.apiRequest.messages[currentStatus].title
        })
      }
    }

    return state
  },*/

  // Client alerts
  [ALERT_ADD]: addAlert,
  [ALERT_REMOVE]: removeAlert
})

export {
  reducer
}
