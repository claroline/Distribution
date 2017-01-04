import {makeActionCreator} from './../utils/actions'

export const ALERT_ADD    = 'ALERT_ADD'
export const ALERT_REMOVE = 'ALERT_REMOVE'

export const actions = {}

actions.addAlert = makeActionCreator(ALERT_ADD, 'type', 'text', 'dismissible')
actions.remvoveAlert = makeActionCreator(ALERT_REMOVE, 'id')
actions.addAlert = (alertType, text, dismissible = true) => {
  return {
    type: ALERT_ADD,
    alertType,
    text,
    dismissible
  }
}
