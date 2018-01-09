import React from 'react'
import {PropTypes as T} from 'prop-types'

import {DatePicker} from '#/main/core/layout/form/components/field/date-picker.jsx'

const DateSearch = props =>
  <span className="date-filter">
    {props.isValid &&
      <span className="available-filter-value">{props.search}</span>
    }
    &nbsp;
    <DatePicker
      name="filter-date"
      className="input-hide"
      showCalendarButton={true}
      onChange={date => props.updateSearch(date)}
    />
  </span>

DateSearch.propTypes = {
  search: T.string.isRequired,
  isValid: T.bool.isRequired,
  updateSearch: T.func.isRequired
}

export {
  DateSearch
}
