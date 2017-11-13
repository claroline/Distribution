import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

const NumberInput = props =>
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

const Number = props => props.unit ?
  <div className="input-group">
    <NumberInput {...props} />
    <span className="input-group-addon">
      {props.unit}
    </span>
  </div>
  :
  <NumberInput {...props} />

implementPropTypes(Number, FormFieldTypes, {
  value: T.number,
  unit: T.string
})

export {
  Number
}
