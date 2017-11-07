import {makeActionCreator} from '#/main/core/utilities/redux'

export const ALERT_ADD = 'ALERT_ADD'
export const ALERT_REMOVE = 'ALERT_REMOVE'

export const actions = {}

actions.addAlert = makeActionCreator(ALERT_ADD, 'alert')
actions.removeAlert = makeActionCreator(ALERT_REMOVE, 'alert')
