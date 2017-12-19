import set from 'lodash/set'
import moment from 'moment'

import {trans, tval} from '#/main/core/translation'

export function notBlank(value, isHtml = false) {
  if (typeof value === 'string') {
    value = value.trim()
  } else if (isNaN(value)) {
    value = ''
  }

  if (value === '' || value === null || (isHtml && isHtmlEmpty(value))) {
    return tval('This value should not be blank.')
  }
}

export function isHtmlEmpty(html, allowedTags = ['img', 'audio', 'iframe', 'video']) {
  if (!html) {
    return true
  }

  const wrapper = document.createElement('div')
  wrapper.innerHTML = html

  return !(wrapper.textContent || allowedTags.some((tag) => {
    return html.indexOf(tag) >= 0
  }))
}

export function number(value) {
  if (typeof value !== 'number' && isNaN(parseFloat(value))) {
    return tval('This value should be a valid number.')
  }
}

export function gteZero(value) {
  if (value < 0) {
    return trans(
      'This value should be {{ limit }} or more.',
      {},
      'validators'
    ).replace('{{ limit }}', 0)
  }
}

export function greaterOrEqual(value, limit) {
  if (value < limit) {
    return trans(
      'value_greater_or_equal_to',
      {limit: limit},
      'validators'
    )
  }
}

export function lowerOrEqual(value, limit) {
  if (value > limit) {
    return trans(
      'value_lower_or_equal_to',
      {limit: limit},
      'validators'
    )
  }
}

export function between(value, min, max) {
  if (value < min || value > max) {
    return trans(
      'value_between',
      {min: min, max: max},
      'validators'
    )
  }
}

export function dateAfter(value, limit) {
  if (moment(value) <= moment(limit)) {
    return trans(
      'date_after',
      {limit: moment(limit).format('YYYY-MM-DD')},
      'validators'
    )
  }
}

export function chain(value, validators) {
  return validators.reduce((result, validate) => {
    return result || validate(value)
  }, undefined)
}

export function setIfError(errors, errorPath, error) {
  if (typeof error !== 'undefined') {
    set(errors, errorPath, error)
  }
}
