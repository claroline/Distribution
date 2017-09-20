import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'

const EmailGroup = props =>
  <FormGroup
    {...props}
  >
    <input
      id={props.controlId}
      type="email"
      className="form-control"
      value={props.value || ''}
      onChange={(e) => props.onChange(e.target.value)}
    />
  </FormGroup>

EmailGroup.propTypes = {
  controlId: T.string.isRequired,
  value: T.string,
  min: T.number,
  max: T.number,
  onChange: T.func.isRequired
}

export {
  EmailGroup
}
