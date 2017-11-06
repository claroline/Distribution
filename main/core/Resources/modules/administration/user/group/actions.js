export const actions = {}

import {REQUEST_SEND} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/layout/form/actions'

import {Group as GroupTypes} from '#/main/core/administration/user/group/prop-types'

actions.open = (groupId = null) => (dispatch) => {
  if (groupId) {
    dispatch({
      [REQUEST_SEND]: {
        route: ['apiv2_workspace_get', {id: groupId}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(response))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(GroupTypes.defaultProps))
  }
}

actions.save = (group, newObject = false) => (dispatch) => {
  dispatch({
    [REQUEST_SEND]: {
      route: newObject ? ['apiv2_group_create'] : ['apiv2_group_update', {id: group.id}],
      request: {
        method: newObject ? 'POST' : 'PUT',
        body: JSON.stringify(group)
      },
      success: (response, dispatch) => {
        dispatch(formActions.resetForm(response))
      }
    }
  })
}