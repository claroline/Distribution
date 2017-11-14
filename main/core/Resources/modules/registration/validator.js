import isEmpty from 'lodash/isEmpty'

import {tval} from '#/main/core/translation'
import {setIfError, notBlank, email} from '#/main/core/validation'

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

  //loops through properties instead
  setIfError(errors, 'username', notBlank(user.username))
  setIfError(errors, 'firstName', notBlank(user.firstName))
  setIfError(errors, 'lastName', notBlank(user.lastName))
  setIfError(errors, 'email', email(user.email))
  setIfError(errors, 'plainPassword', notBlank(user.plainPassword))
  setIfError(errors, 'confirmPlainPassword', notBlank(user.confirmPlainPassword))

  if (user.confirmPlainPassword !== user.plainPassword) {
    errors.confirmPlainPassword
      = errors.plainPassword
      = tval("Password doesn't match the confirmation")
  }

  return errors
}

export {
  isValid,
  validate
}
