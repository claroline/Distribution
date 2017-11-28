import isEmpty from 'lodash/isEmpty'

import {
  setIfError,
  notBlank,
  number
} from '#/main/core/validation'

/**
 * Checks if a Correction data are valid.
 *
 * @param   {Object} correction
 * @param   {Object} dropzone
 *
 * @returns {boolean}
 */
function isValid(correction, dropzone) {
  return isEmpty(validate(correction, dropzone))
}

/**
 * Gets validation errors for a Correction.
 *
 * @param   {Object} correction
 * @param   {Object} dropzone
 *
 * @returns {Object}
 */
function validate(correction, dropzone) {
  const errors = {}

  if (!dropzone.parameters.criteriaEnabled) {
    setIfError(errors, 'totalGrade', notBlank(correction.totalGrade))

    if (!errors['totalGrade']) {
      setIfError(errors, 'totalGrade', number(correction.totalGrade))
    }
  }

  if (dropzone.parameters.commentInCorrectionEnabled && dropzone.parameters.commentInCorrectionForced) {
    setIfError(errors, 'comment', notBlank(correction.comment))
  }

  return errors
}

/**
 * Checks if a value is empty and returns an error message if it is.
 *
 * @param   string value
 *
 * @returns string
 */
function validateNotBlank(value) {
  return notBlank(value)
}

export {
  isValid,
  validate,
  validateNotBlank
}
