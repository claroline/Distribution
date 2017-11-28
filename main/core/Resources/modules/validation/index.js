import set from 'lodash/set'

import {trans, tval} from '#/main/core/translation'

function notBlank(value, isHtml = false) {
  if (typeof value === 'string') {
    value = value.trim()
  } else if (isNaN(value)) {
    value = ''
  }

  if (value === '' || value === null || (isHtml && isHtmlEmpty(value))) {
    return tval('This value should not be blank.')
  }
}

function string(value) {
  if (typeof value !== 'string') {
    return tval('This value should be a string.')
  }
}

function isHtmlEmpty(html, allowedTags = ['img', 'audio', 'iframe', 'video']) {
  if (!html) {
    return true
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  return !(wrapper.textContent || allowedTags.some((tag) => {
    return html.indexOf(tag) >= 0
  }))
}

function number(value) {
  if (typeof value !== 'number' && (isNaN(parseFloat(value)) || !isFinite(value))) {
    return tval('This value should be a valid number.')
  }
}

function gtZero(value) {
  if (value <= 0) {
    return trans(
      'This value should be greater than {{ limit }}.',
      {},
      'validators'
    ).replace('{{ limit }}', 0)
  }
}

function gtMin(value, options) {
  if (undefined !== options.min && value < options.min) {
    return trans(
      'This value should be greater than {{ limit }}.',
      {},
      'validators'
    ).replace('{{ limit }}', options.min)
  }
}

function ltMax(value, options) {
  if (undefined !== options.max && value > options.max) {
    return trans(
      'This value should be lower than {{ limit }}.',
      {},
      'validators'
    ).replace('{{ limit }}', options.max)
  }
}

function inRange(value, options) {
  return chain(value, options, [gtMin, ltMax])
}

function email(value) {
  if (!/^\w+([\.-]?\ w+)*@\w+([\.-]?\ w+)*(\.\w{2,3})+$/.test(value)) {
    return tval('This value should be a valid email.')
  }
}

function gteZero(value) {
  if (value < 0) {
    return trans(
      'This value should be {{ limit }} or more.',
      {},
      'validators'
    ).replace('{{ limit }}', 0)
  }
}

function notEmptyArray(value) {
  if (value.length === 0) {
    return tval('This value should not be blank.')
  }
}

/**
 * Disables `validator` if `condition` is not met.
 * NB. This doesn't call the validator itself.
 *
 * @param {bool}     condition
 * @param {function} validator
 *
 * @return {function}
 */
function validateIf(condition, validator) {
  if (condition) {
    return validator
  }

  // if condition is not met, we just return a func that will never throw error
  return () => undefined
}

function chain(value, options, validators) {
  return validators.reduce((result, validate) => {
    return result || validate(value, options)
  }, undefined)
}

function setIfError(errors, errorPath, error) {
  if (typeof error !== 'undefined') {
    set(errors, errorPath, error)
  }
}

export {
  validateIf,
  chain,
  setIfError,

  // validators
  string,
  notBlank,
  isHtmlEmpty,
  number,
  inRange,
  gtMin,
  ltMax,
  gtZero,
  email,
  gteZero,
  notEmptyArray
}
