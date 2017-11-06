import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'

import {FormGroup as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'

const NumberGroup = props =>
  <FormGroup {...props}>
    <input
      id={props.id}
      type="number"
      className="form-control"
      value={isNaN(props.value) ? undefined : props.value}
      disabled={props.disabled}
      min={props.min}
      max={props.max}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </FormGroup>

implementPropTypes(NumberGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.number,
  // custom props
  min: T.number,
  max: T.number
})

export {
  NumberGroup
}
