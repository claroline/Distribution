import {makeInstanceActionCreator} from '#/main/core/utilities/redux'

export const FORM_RESET       = 'FORM_RESET'
export const FORM_VALIDATE    = 'FORM_VALIDATE'
export const FORM_SUBMIT      = 'FORM_SUBMIT'
export const FORM_UPDATE_PROP = 'FORM_UPDATE_PROP'

export const actions = {}

actions.validateForm = makeInstanceActionCreator(FORM_VALIDATE, 'errors')
actions.submitForm = makeInstanceActionCreator(FORM_SUBMIT)
actions.updateProp = makeInstanceActionCreator(FORM_UPDATE_PROP, 'propName', 'propValue')
actions.resetForm = (formName, data = {}, isNew = false) => {
  return {
    type: FORM_RESET,
    instanceName: formName,
    data: data,
    isNew: isNew
  }
}
