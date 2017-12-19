import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'

const TextGroup = props =>
  <FormGroup
    {...props}
  >
    {props.long &&
      <textarea
        id={props.controlId}
        className="form-control"
        value={props.value || ''}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
        rows={3}
      />
    }

    {!props.long &&
      <input
        id={props.controlId}
        type="text"
        className="form-control"
        value={props.value || ''}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={(e) => props.onChange(e.target.value)}
      />
    }
  </FormGroup>

TextGroup.propTypes = {
  controlId: T.string.isRequired,
  long: T.bool,
  value: T.string,
  placeholder: T.string,
  disabled: T.bool.isRequired,
  onChange: T.func.isRequired
}

TextGroup.defaultProps = {
  value: '',
  placeholder: '',
  long: false,
  disabled: false
}

export {
  TextGroup
}
