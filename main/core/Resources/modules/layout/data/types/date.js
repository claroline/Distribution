import moment from 'moment'

import {t} from '#/main/core/translation'

import {DateSearch} from '#/main/core/layout/data/types/components/date.jsx'

export const DATE_TYPE = 'date'

export const dateDefinition = {
  /**
   * Parses display date into ISO 8601 date.
   *
   * @param {string} display
   *
   * @return {string}
   */
  parse: (display) => display,

  /**
   * Renders ISO date into locale date.
   *
   * @param {string} raw
   *
   * @return {string}
   */
  render: (raw) => moment(raw).format(t('date_range.js_format')),

  /**
   * Validates input value for a date.
   *
   * @param {string} value
   *
   * @return {boolean}
   */
  validate: (value) => typeof value === 'string' && moment(value).isValid(),
  components: {
    display: null,
    form: null,
    table: null,
    search: DateSearch
  }
}
