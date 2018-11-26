import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'

const actions = {}

actions.openForm = (formName, id = null) => (dispatch) => {
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
    dispatch(actions.resetForm(formName))
  }
}

actions.resetForm = (formName) => (dispatch) => {
  dispatch(formActions.resetForm(formName, {}, true))
}

export {
  actions
}