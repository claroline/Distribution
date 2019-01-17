import invariant from 'invariant'

import {actions as overlayActions} from '#/main/app/overlay/store/actions'

import {constants as actionConstants} from '#/main/app/action/constants'
import {constants} from '#/main/app/overlay/alert/constants'
import {selectors} from '#/main/app/overlay/alert/store/selectors'

// actions
export const ALERT_ADD    = 'ALERT_ADD'
export const ALERT_REMOVE = 'ALERT_REMOVE'

// action creators
export const actions = {}

actions.addAlert = (id, status, action = actionConstants.ACTION_GENERIC, title = null, message = null) => (dispatch, getState) => {
  // validates params
  invariant(id, 'id is required')
  invariant(status, 'status is required')
  invariant(-1 !== Object.keys(constants.ALERT_STATUS).indexOf(status), 'status must be one of the defined ALERT_STATUS.')
  invariant(-1 !== Object.keys(actionConstants.ACTIONS).indexOf(action), 'action must be one of the defined ACTIONS')
  invariant(Object.keys(constants.ALERT_ACTIONS[action][status]), 'action does not implement the alert status')

  if (0 === selectors.alerts(getState()).length) {
    // display overlay when first alert is displayed
    //dispatch(overlayActions.showOverlay('alert'))
  }

  return dispatch({
    type: ALERT_ADD,
    id,
    status,
    action,
    message,
    title
  })
}

actions.removeAlert = (id) => (dispatch, getState) => {
  // validates params
  invariant(id, 'id is required')

  if (1 === selectors.alerts(getState()).length) {
    // hide overlay when last alert is removed
    //dispatch(overlayActions.hideOverlay('alert'))
  }

  return dispatch({
    type: ALERT_REMOVE,
    id
  })
}
