import cloneDeep from 'lodash/cloneDeep'

import {makeReducer} from '#/main/core/utilities/redux'
import {makeFormReducer} from '#/main/core/layout/form/reducer'
import {validate, isValid} from '#/main/core/registration/validator'

import {
  USER_UPDATE,
  USER_VALIDATE
} from './actions'

const optionsReducer = makeReducer([], {

})

const userReducer = makeReducer({}, {
  [USER_UPDATE]: (state, action) => {
    state = cloneDeep(state)
    state[action.property] = action.value
    state.errors = validate(state)

    return state
  },
  [USER_VALIDATE]: (state, action) => {
    state = cloneDeep(state)
    state.errors = validate(state)
    action.errors.forEach(error => {
      state.errors[error.path] = error.message
    })

    return state
  }
})

export const reducer = {
  user: makeFormReducer('user', {
    new: true
  }),
  options: optionsReducer
}
