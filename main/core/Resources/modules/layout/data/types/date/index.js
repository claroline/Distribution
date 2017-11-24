import {isValidDate, localeDate, serverDate} from '#/main/core/date'

import {DateSearch} from '#/main/core/layout/data/types/date/components/search.jsx'

const DATE_TYPE = 'date'

const dateDefinition = {
  /**
   * Parses display date into ISO 8601 date.
   *
   * @param {string} display
   *
   * @return {string}
   */
  parse: (display) => display ? serverDate(display, false) : null,

  /**
   * Renders ISO date into locale date.
   *
   * @param {string} raw
   *
   * @return {string}
   */
  render: (raw) => raw ? localeDate(raw, false) : null,

  /**
   * Validates input value for a date.
   *
   * @param {string} value
   *
   * @return {boolean}
   */
  validate: (value) => typeof value === 'string' && isValidDate(value),

  components: {
    search: DateSearch
  }
}

export {
  DATE_TYPE,
  dateDefinition
}
