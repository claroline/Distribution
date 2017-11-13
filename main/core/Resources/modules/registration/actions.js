import {makeActionCreator} from '#/main/core/utilities/redux'
import {REQUEST_SEND} from '#/main/core/api/actions'
import {generateUrl} from '#/main/core/fos-js-router'

export const USER_UPDATE = 'USER_UPDATE'
export const USER_CREATE = 'USER_CREATE'
export const actions = {}

actions.updateUser = makeActionCreator(USER_UPDATE, 'property', 'value')

actions.createUser = (user) => ({
  [REQUEST_SEND]: {
    url: generateUrl('apiv2_user_create'),
    request: {
      method: 'POST',
      body: JSON.stringify(user)
    },
    success: (data, dispatch) => {
        alert('//callback for user creation and stuff')
    }
  }
})
