import moment from 'moment'

import {t} from '#/main/core/translation'

function isValidDate(value) {
  return moment(value).isValid()
}

function localeDate(date) {
  return moment(date).format(t('date_range.js_format'))
}

function serverDate(displayDate) {
  return moment(displayDate, t('date_range.js_format')).toISOString()
}

export {
  isValidDate,
  localeDate,
  serverDate
}
