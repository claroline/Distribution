import isEmpty from 'lodash/isEmpty'

import {tval} from '#/main/core/translation'
import {setIfError, notBlank} from '#/main/core/validation'

/**
 * Checks if a Theme data are valid.
 *
 * @param   {Object} theme
 *
 * @returns {boolean}
 */
function isValid(theme) {
  return isEmpty(validate(theme))
}

/**
 * Gets validation errors for a Theme.
 *
 * @param   {Object} theme
 *
 * @returns {Object}
 */
function validate(user) {
  const errors = {}

  setIfError(errors, 'username', notBlank(user.username))
  setIfError(errors, 'firstName', notBlank(user.firstName))
  setIfError(errors, 'lastName', notBlank(user.lastName))
  setIfError(errors, 'email', email(user.email))

  return errors
}

export {
  isValid,
  validate
}
