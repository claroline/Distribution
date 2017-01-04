import uuid from 'uuid'

import {update} from './../utils/utils'
import {makeReducer} from './../utils/reducers'

// TODO : validate params

import {
  ALERT_ADD,
  ALERT_REMOVE
} from './actions'

function addAlert(alerts, action) {
  const alert = {
    id: uuid(),
    text: action.text,
    type: action.type,
    dismissible: !!action.dismissible
  }

  return update(alerts, {[alert.id]: {$set: alert}})
}

function removeAlert(alerts, action) {
  return update(alerts, {$delete: action.id})
}

export const reducers = makeReducer({}, {
  [ALERT_ADD]: addAlert,
  [ALERT_REMOVE]: removeAlert
})
