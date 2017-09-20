import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {DatePicker} from '#/main/core/layout/form/components/field/date-picker.jsx'

const DatePickerGroup = props =>
  <FormGroup
    {...props}
  >
    <DatePicker
      controlId={props.controlId}
      dateFormat={props.dateFormat}
      minDate={props.minDate}
      value={props.value || ''}
      showCalendarButton={props.showCalendarButton}
      onChange={props.onChange}
    />
  </FormGroup>

DatePickerGroup.propTypes = {
  controlId: T.string.isRequired,
  dateFormat: T.string,
  minDate: T.object,
  showCalendarButton: T.bool,
  value: T.string,
  onChange: T.func.isRequired
}

export {
  DatePickerGroup
}
