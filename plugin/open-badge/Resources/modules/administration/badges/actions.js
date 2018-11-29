import {makeActionCreator} from '#/main/app/store/actions'
import {API_REQUEST} from '#/main/app/api'
import {actions as formActions} from '#/main/app/content/form/store'

export const actions = {}

actions.open = (formName, id = null) => {
  if (id) {
    return {
      [API_REQUEST]: {
        url: ['apiv2_badge-class_get', {id}],
        before: (dispatch) => {
          dispatch(formActions.resetForm(formName, {}, false))
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    }
  } else {
    return formActions.resetForm(formName, {}, true)
  }
}
