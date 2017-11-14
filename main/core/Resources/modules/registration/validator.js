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

  return errors
}

function validateProperty(errors, property, value) {
  const notBlankProps = ['username', 'firstName', 'lastName']
  const emailProps = ['email']

  if (notBlankProps.indexOf(property) >= -1) {
    errors[property] = notBlank(value)
    //setIfError(errors, property, notBlank(value))
  }

  if (emailProps.indexOf(property) > -1) {
    errors[property] = email(value)
    //setIfError(errors, property, email(value))
  }
}

export {
  isValid,
  validate,
  validateProperty
}
