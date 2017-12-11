export const actions = {}

import {generateUrl} from '#/main/core/fos-js-router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as listActions} from '#/main/core/data/list/actions'
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

actions.addUsers = (id, users) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_role_add_users', {id: id}) +'?'+ users.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('roles.list'))
      dispatch(listActions.invalidateData('roles.current.users'))
    }
  }
})

actions.addGroups = (id, groups) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_role_add_groups', {id: id}) +'?'+ groups.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('roles.list'))
      dispatch(listActions.invalidateData('roles.current.groups'))
    }
  }
})
