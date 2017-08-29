import React from 'react'
import {PropTypes as T} from 'prop-types'

const Checkbox = props =>
  <div className="checkbox">
    <label htmlFor={props.id}>
      <input
        id={props.id}
        type="checkbox"
        checked={props.checked}
        onChange={e => props.onChange(e.target.checked)}
      />

      {props.checked && props.labelChecked ? props.labelChecked : props.label}
    </label>
  </div>

Checkbox.propTypes = {
  id: T.string.isRequired,
  label: T.string.isRequired,
  labelChecked: T.string,
  checked: T.bool.isRequired,
  onChange: T.func.isRequired
}

export {
  Checkbox
}
