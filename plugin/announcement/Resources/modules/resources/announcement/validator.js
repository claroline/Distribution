import isEmpty from 'lodash/isEmpty'

import {tval} from '#/main/core/translation'
import {setIfError, notBlank} from '#/main/core/validation'

/**
 * Checks if a Announce data are valid.
 *
 * @param   {Object} announce
 *
 * @returns {boolean}
 */
function isValid(announce) {
  return isEmpty(validate(announce))
}

/**
 * Gets validation errors for an Announce.
 *
 * @param   {Object} announce
 *
 * @returns {Object}
 */
function validate(announce) {
  const errors = {}

  setIfError(errors, 'content', notBlank(announce.content))

  return errors
}

export {
  isValid,
  validate
}
