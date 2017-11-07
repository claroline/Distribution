import invariant from 'invariant'
import {makeActionCreator} from '#/main/core/utilities/redux'

export const FORM_RESET       = 'FORM_RESET'
export const FORM_VALIDATE    = 'FORM_VALIDATE'
export const FORM_SUBMIT      = 'FORM_SUBMIT'
export const FORM_UPDATE_PROP = 'FORM_UPDATE_PROP'

export const actions = {}

actions.resetForm = (data, isNew = false) => {
  invariant(data !== undefined, `data is required`)

  return {
    type: FORM_RESET,
    data: data,
    isNew: isNew
  }
}

actions.validateForm = makeActionCreator(FORM_VALIDATE, 'errors')
actions.submitForm = makeActionCreator(FORM_SUBMIT)
actions.updateProp = makeActionCreator(FORM_UPDATE_PROP, 'propName', 'propValue')
