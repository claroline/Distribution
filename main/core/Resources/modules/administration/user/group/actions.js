import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/layout/form/actions'

import {Group as GroupTypes} from '#/main/core/administration/user/group/prop-types'

export const actions = {}

actions.open = (formName, groupId = null) => (dispatch) => {
  if (groupId) {
    dispatch({
      [REQUEST_SEND]: {
        route: ['apiv2_group_get', {id: groupId}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, GroupTypes.defaultProps, true))
  }
}
