export const actions = {}

import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/layout/form/actions'

import {Role as RoleTypes} from '#/main/core/administration/user/role/prop-types'

actions.open = (formName, id = null) => (dispatch) => {
  // todo ugly. only to be able to load list before the end of  group loading
  dispatch(formActions.resetForm(formName, {id}, false))

  if (id) {
    dispatch({
      [REQUEST_SEND]: {
        route: ['apiv2_role_get', {id}],
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
