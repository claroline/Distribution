import {setIfError, notBlank, notEmptyArray} from '#/main/core/validation'

/**
 * Gets validation errors for a Group.
 *
 * @param   {Object} group
 *
 * @returns {Object}
 */
function validate(user) {
  const errors = {}

  setIfError(errors, 'name', notBlank(user.username))

  return errors
}

export {
  validate
}
