import {makeInstanceActionCreator} from '#/main/core/utilities/redux'

import {select as formSelect} from '#/main/core/layout/form/selectors'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const FORM_RESET       = 'FORM_RESET'
export const FORM_SET_ERRORS  = 'FORM_SET_ERRORS'
export const FORM_SUBMIT      = 'FORM_SUBMIT'
export const FORM_UPDATE_PROP = 'FORM_UPDATE_PROP'

export const actions = {}

actions.setErrors = makeInstanceActionCreator(FORM_SET_ERRORS, 'errors')
actions.submitForm = makeInstanceActionCreator(FORM_SUBMIT)
actions.updateProp = makeInstanceActionCreator(FORM_UPDATE_PROP, 'propName', 'propValue')

actions.resetForm = (formName, data = {}, isNew = false) => {
  return {
    type: FORM_RESET+'/'+formName,
    data: data,
    isNew: isNew
  }
}

actions.saveForm = (formName, target) => (dispatch, getState) => {
  const formNew = formSelect.isNew(formSelect.form(getState(), formName))
  const formData = formSelect.data(formSelect.form(getState(), formName))

  dispatch(actions.submitForm(formName))

  dispatch({
    [REQUEST_SEND]: {
      url: target,
      request: {
        method: formNew ? 'POST' : 'PUT',
        body: JSON.stringify(formData)
      },
      success: (response, dispatch) => {
        dispatch(actions.resetForm(formName, response, false))
      }
    }
  })
}
