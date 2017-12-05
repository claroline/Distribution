export const actions = {}

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'

import {Role as RoleTypes} from '#/main/core/administration/user/role/prop-types'

actions.open = (formName, id = null) => (dispatch) => {
  // todo ugly. only to be able to load list before the end of  group loading
  dispatch(formActions.resetForm(formName, {id}, false))

  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_role_get', {id}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, RoleTypes.defaultProps, true))
  }
}
