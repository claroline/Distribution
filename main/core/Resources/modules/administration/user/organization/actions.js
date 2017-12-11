import {generateUrl} from '#/main/core/fos-js-router'

import {API_REQUEST} from '#/main/core/api/actions'
import {actions as formActions} from '#/main/core/data/form/actions'
import {actions as listActions} from '#/main/core/data/list/actions'

/*import {Group as GroupTypes} from '#/main/core/administration/user/group/prop-types'*/

export const actions = {}

actions.open = (formName, organizationId = null) => (dispatch) => {
  if (organizationId) {
    // todo ugly. only to be able to load lists before the end of organization loading
    dispatch(formActions.resetForm(formName, {id: organizationId}, false))

    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_organization_get', {id: organizationId}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, false))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, {}, true))
  }
}

actions.addUsers = (id, users) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_organization_add_users', {id: id}) +'?'+ users.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('organizations.list'))
      dispatch(listActions.invalidateData('organizations.current.users'))
    }
  }
})

actions.addWorkspaces = (id, workspaces) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_organization_add_workspaces', {id: id}) +'?'+ workspaces.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('organizations.list'))
      dispatch(listActions.invalidateData('organizations.current.workspaces'))
    }
  }
})

actions.addGroups = (id, groups) => ({
  [API_REQUEST]: {
    url: generateUrl('apiv2_organization_add_groups', {id: id}) +'?'+ groups.map(id => 'ids[]='+id).join('&'),
    request: {
      method: 'PATCH'
    },
    success: (data, dispatch) => {
      dispatch(listActions.invalidateData('organizations.list'))
      dispatch(listActions.invalidateData('organizations.current.groups'))
    }
  }
})
