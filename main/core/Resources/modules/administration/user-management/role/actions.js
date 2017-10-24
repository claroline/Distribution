import {makeActionCreator} from '#/main/core/utilities/redux'
import {generateUrl} from '#/main/core/fos-js-router'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const ROLE_EDIT = 'ROLE_EDIT'
export const ROLE_SAVE = 'ROLE_SAVE'
export const ROLE_ADD = 'ROLE_ADD'

export const actions = {}

actions.editRole = makeActionCreator(ROLE_EDIT, 'role')
actions.saveRole = makeActionCreator(ROLE_SAVE)

actions.addRole = (role) => ({
  [REQUEST_SEND]: {
    url: generateUrl('api_role_create'),
    request: {
      method: 'POST',
      body: JSON.stringify(role)
    },
    success: (data, dispatch) => dispatch(actions.fetchRoles())
  }
})
