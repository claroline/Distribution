import isEmpty from 'lodash/isEmpty'
import set from 'lodash/set'

import {trans} from '#/main/core/translation'
import {
  setIfError,
  notBlank,
  number,
  greaterOrEqual,
  between,
  dateAfter
} from '#/main/core/validation'

/**
 * Checks if a Dropzone data are valid.
 *
 * @param   {Object} dropzone
 *
 * @returns {boolean}
 */
function isValid(dropzone) {
  return isEmpty(validate(dropzone))
}

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
  setIfError(errors, 'criteriaTotal', notBlank(dropzone.parameters.criteriaTotal))
  setIfError(errors, 'scoreMax', notBlank(dropzone.parameters.scoreMax))
  setIfError(errors, 'scoreToPass', notBlank(dropzone.parameters.scoreToPass))

  if (!errors['criteriaTotal']) {
    setIfError(errors, 'criteriaTotal', number(dropzone.parameters.criteriaTotal))
  }
  if (!errors['scoreMax']) {
    setIfError(errors, 'scoreMax', number(dropzone.parameters.scoreMax))
  }
  if (!errors['scoreToPass']) {
    setIfError(errors, 'scoreToPass', number(dropzone.parameters.scoreToPass))
  }
  if (!errors['criteriaTotal']) {
    setIfError(errors, 'criteriaTotal', greaterOrEqual(dropzone.parameters.criteriaTotal, 2))
  }
  if (!errors['scoreMax']) {
    setIfError(errors, 'scoreMax', greaterOrEqual(dropzone.parameters.scoreMax, 0))
  }
  if (!errors['scoreMax'] && !errors['scoreToPass']) {
    setIfError(errors, 'scoreToPass', between(dropzone.parameters.scoreToPass, 0, dropzone.parameters.scoreMax))
  }
  if (dropzone.parameters.criteriaEnabled) {
    if (dropzone.criteria.length === 0) {
      set(errors, 'criteriaEnabled', trans('no_criterion_defined', {}, 'dropzone'))
    }
    dropzone.criteria.forEach(c => setIfError(errors, `criterion.${c.id}`, notBlank(c.instruction)))
  }
  if (!dropzone.parameters.manualPlanning) {
    setIfError(errors, 'dropStartDate', notBlank(dropzone.parameters.dropStartDate))
    setIfError(errors, 'dropEndDate', notBlank(dropzone.parameters.dropEndDate))

    if (!errors['dropStartDate'] && !errors['dropEndDate']) {
      setIfError(errors, 'dropEndDate', dateAfter(dropzone.parameters.dropEndDate, dropzone.parameters.dropStartDate))
    }
    if (dropzone.parameters.peerReview) {
      setIfError(errors, 'reviewStartDate', notBlank(dropzone.parameters.reviewStartDate))
      setIfError(errors, 'reviewEndDate', notBlank(dropzone.parameters.reviewEndDate))

      if (!errors['reviewStartDate'] && !errors['reviewEndDate']) {
        setIfError(errors, 'reviewEndDate', dateAfter(dropzone.parameters.reviewEndDate, dropzone.parameters.reviewStartDate))
      }
    }
  }
  if (dropzone.display.displayNotationMessageToLearners) {
    setIfError(errors, 'successMessage', notBlank(dropzone.display.successMessage))
    setIfError(errors, 'failMessage', notBlank(dropzone.display.failMessage))
  }

  return errors
}

export {
  isValid,
  validate
}
