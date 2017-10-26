import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {navigate} from '#/main/core/router'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const DROPZONE_LOAD = 'DROPZONE_LOAD'
export const DROPZONE_FORM_LOAD = 'DROPZONE_FORM_LOAD'
export const DROPZONE_FORM_RESET = 'DROPZONE_FORM_RESET'
export const DROPZONE_FORM_VALIDATE = 'DROPZONE_FORM_VALIDATE'
export const DROPZONE_PARAMETERS_UPDATE = 'DROPZONE_PARAMETERS_UPDATE'
export const DROPZONE_DISPLAY_UPDATE = 'DROPZONE_DISPLAY_UPDATE'
export const DROPZONE_NOTIFICATIONS_UPDATE = 'DROPZONE_NOTIFICATIONS_UPDATE'
export const DROPZONE_CRITERION_ADD = 'DROPZONE_CRITERION_ADD'
export const DROPZONE_CRITERION_UPDATE = 'DROPZONE_CRITERION_UPDATE'
export const DROPZONE_CRITERION_REMOVE = 'DROPZONE_CRITERION_REMOVE'

export const actions = {}

actions.loadDropzone = makeActionCreator(DROPZONE_LOAD, 'dropzone')
actions.loadForm = makeActionCreator(DROPZONE_FORM_LOAD, 'dropzone')
actions.resetForm = makeActionCreator(DROPZONE_FORM_RESET)
actions.validateForm = makeActionCreator(DROPZONE_FORM_VALIDATE)
actions.updateParameters = makeActionCreator(DROPZONE_PARAMETERS_UPDATE, 'property', 'value')
actions.updateDisplay = makeActionCreator(DROPZONE_DISPLAY_UPDATE, 'property', 'value')
actions.updateNotifications = makeActionCreator(DROPZONE_NOTIFICATIONS_UPDATE, 'property', 'value')
actions.addCriterion = makeActionCreator(DROPZONE_CRITERION_ADD, 'dropzoneId')
actions.updateCriterion = makeActionCreator(DROPZONE_CRITERION_UPDATE, 'id', 'property', 'value')
actions.removeCriterion = makeActionCreator(DROPZONE_CRITERION_REMOVE, 'id')

actions.saveDropzone = (dropzoneId, dropzone) => {
  return (dispatch) => {
    dispatch(actions.updateDropzone(dropzoneId, dropzone))
    //dispatch(actions.validateForm())
    //
    //if (isValid(dropzone)) {
    //  dispatch(actions.updateDropzone(dropzoneId, dropzone))
    //}
  }
}

actions.updateDropzone = (dropzoneId, dropzone) => ({
  [REQUEST_SEND]: {
    url: generateUrl('claro_dropzone_update', {id: dropzoneId}),
    request: {
      method: 'PUT',
      body: JSON.stringify(dropzone)
    },
    success: (data, dispatch) => {
      dispatch(actions.loadDropzone(data))
      navigate('/')
    }
  }
})