import {API_REQUEST} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/fos-js-router'
import {actions as listActions} from '#/main/core/layout/list/actions'
import {User as UserTypes} from '#/main/core/administration/user/user/prop-types'
import {actions as formActions} from '#/main/core/layout/form/actions'

export const actions = {}

actions.enable = (user) => ({
  [API_REQUEST]: {
    url: ['apiv2_user_update', {uuid: user.id}],
    request: {
      body: JSON.stringify({isEnabled: true, uuid: user.id}),
      method: 'PUT'
    },
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.disable = (user) => ({
  [API_REQUEST]: {
    url: ['apiv2_user_update', {uuid: user.id}],
    request: {
      method: 'PUT',
      body: JSON.stringify({isEnabled: false, uuid: user.id})
    },
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.createWorkspace = (user) => ({
  [API_REQUEST]: {
    url: ['apiv2_user_pws_create', {uuid: user.id}],
    request: { method: 'POST'},
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.deleteWorkspace = (user) => ({
  [API_REQUEST]: {
    url: ['apiv2_user_pws_delete', {uuid: user.id}],
    request: {method: 'DELETE'},
    success: (data, dispatch) => dispatch(listActions.fetchData('users'))
  }
})

actions.open = (formName, id = null) => (dispatch) => {
  // todo ugly. only to be able to load list before the end of  group loading
  dispatch(formActions.resetForm(formName, {id}, false))

  if (id) {
    dispatch({
      [API_REQUEST]: {
        url: ['apiv2_user_get', {id}],
        request: {
          method: 'GET'
        },
        success: (response, dispatch) => {
          dispatch(formActions.resetForm(formName, response, true))
        }
      }
    })
  } else {
    dispatch(formActions.resetForm(formName, UserTypes.defaultProps, true))
  }
}
