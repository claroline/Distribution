import {isValidDate, localeDate, serverDate} from '#/main/core/date'

import {DateSearch} from '#/main/core/layout/data/types/date/components/search.jsx'

const DATETIME_TYPE = 'datetime'

const datetimeDefinition = {
  /**
   * Parses display datetime into ISO 8601 datetime.
   *
   * @param {string} display
   *
   * @return {string}
   */
  parse: (display) => display ? serverDate(display, true) : null,

  /**
   * Renders ISO datetime into locale datetime.
   *
   * @param {string} raw
   *
   * @return {string}
   */
  render: (raw) => raw ? localeDate(raw, true) : null,

  /**
   * Validates input value for a datetime.
   *
   * @param {string} value
   *
   * @return {boolean}
   */
  validate: (value) => typeof value === 'string' && isValidDate(value),

  components: {
    search: DateSearch // todo replace with one with time selector
  }
}

export {
  DATETIME_TYPE,
  datetimeDefinition
}