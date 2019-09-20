import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'
import {selectors} from '#/main/app/security/password/reset/store/selectors'
import {actions as alertActions} from '#/main/app/overlays/alert/store'
import {constants as alertConstants} from '#/main/app/overlays/alert/constants'

// action creators
export const actions = {}
/**
 * Fetch the required data to open the current user desktop.
 */
actions.reset = (data, callback = () => {}) => ({
  [API_REQUEST]: {
    url: ['claro_security_new_password'],
    request: {
      method: 'POST',
      body: JSON.stringify(data)
    },
    success: (response, dispatch) => {
      dispatch(alertActions.addAlert(
        // id
        'ALERT_RESET_PASSWORD_SUCCESS',
        // status
        alertConstants.ALERT_STATUS_SUCCESS,
        // action
        alertActions.ALERT_ADD,
        // title
        null,
        // message
        response
      )),
      callback()
    },
    error: (response, status, dispatch) => {
      if (response.error) {
        dispatch(formActions.setErrors(selectors.FORM_NAME, response.error))
      } else {
        dispatch(alertActions.addAlert(
          // id
          'ALERT_RESET_PASSWORD_RESET_ERROR',
          // status
          alertConstants.ALERT_STATUS_ERROR,
          // action
          alertActions.ALERT_ADD,
          // title
          null,
          // message
          response
        ))
      }
    }
  }
})
