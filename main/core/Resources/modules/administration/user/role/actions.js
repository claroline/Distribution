export const actions = {}

import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/layout/form/actions'

import {Role as RoleTypes} from '#/main/core/administration/user/role/prop-types'

actions.open = (uuid = null) => (dispatch) => {
  if (uuid) {
    dispatch({
      [REQUEST_SEND]: {
        route: ['apiv2_role_get', {uuid}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(response))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(RoleTypes.defaultProps))
  }
}
