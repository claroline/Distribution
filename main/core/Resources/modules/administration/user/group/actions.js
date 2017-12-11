import {generateUrl} from '#/main/core/fos-js-router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as listActions} from '#/main/core/data/list/actions'

import {Group as GroupTypes} from '#/main/core/administration/user/group/prop-types'

export const actions = {}

actions.open = (formName, id = null) => (dispatch) => {
  if (id) {
    // todo ugly. only to be able to load list before the end of  group loading
    dispatch(formActions.resetForm(formName, {id}, false))

    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_group_get', {id}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => dispatch(formActions.resetForm(formName, response, false))
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, GroupTypes.defaultProps, true))
  }
}

actions.addUsers = (id, users) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_group_add_users', {id: id}) +'?'+ users.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('groups.list'))
      dispatch(listActions.invalidateData('groups.current.users'))
    }
  }
})

actions.addRoles = (id, roles) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_group_add_roles', {id: id}) +'?'+ roles.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('groups.list'))
      dispatch(listActions.invalidateData('groups.current.roles'))
    }
  }
})
