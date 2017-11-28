import {makeActionCreator} from '#/main/core/utilities/redux'
import {REQUEST_SEND} from '#/main/core/api/actions'

export const USER_UPDATE   = 'USER_UPDATE'
export const USER_CREATE   = 'USER_CREATE'
export const USER_VALIDATE = 'USER_VALIDATE'

export const actions = {}

actions.updateUser = makeActionCreator(USER_UPDATE, 'property', 'value')
actions.validateUser = makeActionCreator(USER_VALIDATE, 'errors')

actions.createUser = (user, onCreated) => ({
  [REQUEST_SEND]: {
    url: ['apiv2_user_create'],
    request: {
      method: 'POST',
      body: JSON.stringify(user)
    },
    success: (data, dispatch) => {
      onCreated()
    },
    error: (data, dispatch) => {
      data.json().then(errors => {
        dispatch(actions.validateUser(errors))
      })
    }
  }
})
