import {setIfError, notBlank, notEmptyArray} from '#/main/core/validation'

/**
 * Gets validation errors for a Group.
 *
 * @param   {Object} group
 *
 * @returns {Object}
 */
function validate(role) {
  const errors = {}

  setIfError(errors, 'name', notBlank(role.name))

  return errors
}

export {
  validate
}
