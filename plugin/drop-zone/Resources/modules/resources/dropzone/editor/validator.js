import {setIfError, notBlank} from '#/main/core/validation'

/**
 * Gets validation errors for a Dropzone resource.
 *
 * @param   {Object} dropzone
 *
 * @returns {Object}
 */
function validate(dropzone) {
  const errors = {}

  setIfError(errors, 'instruction', notBlank(dropzone.display.instruction))

  return errors
}

export {
  validate
}
