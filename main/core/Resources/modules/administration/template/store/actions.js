import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'

const actions = {}

actions.openForm = (formName, defaultData = {}, id = null) => (dispatch) => {
  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_template_get', {id}],
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(actions.resetForm(formName, defaultData))
  }
}

actions.resetForm = (formName, defaultData = {}) => (dispatch) => {
  dispatch(formActions.resetForm(formName, defaultData, true))
}

export {
  actions
}