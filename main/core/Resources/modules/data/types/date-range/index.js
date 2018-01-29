import {isValidDate, localeDate, serverDate} from '#/main/core/scaffolding/date'
import {t} from '#/main/core/translation'

import {DateRangeGroup} from '#/main/core/layout/form/components/group/date-range-group.jsx'
import {DateSearch} from '#/main/core/data/types/date/components/search.jsx'

const DATE_RANGE_TYPE = 'date-range'

const dateRangeDefinition = {
  meta: {
    type: DATE_RANGE_TYPE,
    creatable: false,
    icon: 'fa fa-fw fa-calendar',
    label: t('date_range'),
    description: t('date_range_desc')
  },

  /**
   * Validates input value for a date range.
   *
   * @param {string} value
   *
   * @return {boolean}
   */
  validate: (value) => {
    // it's an array of strings
    // it contains two valid dates or null
    // start < end
  },

  components: {
    form: DateRangeGroup,
    //search: DateSearch
  }
}

export {
  DATE_RANGE_TYPE,
  dateRangeDefinition
}
