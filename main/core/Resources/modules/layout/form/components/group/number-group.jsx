import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'

const NumberGroup = props =>
  <FormGroup {...props}>
    <input
      id={props.controlId}
      type="number"
      className="form-control"
      value={props.value || ''}
      min={props.min}
      max={props.max}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </FormGroup>

NumberGroup.propTypes = {
  controlId: T.string.isRequired,
  value: T.number,
  min: T.number,
  max: T.number,
  onChange: T.func.isRequired
}

export {
  NumberGroup
}
