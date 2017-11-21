import React from 'react'
import {PropTypes as T} from 'prop-types'

const getSelectedValues = (e) => {
  const values = []

  for (let i = 0; i < e.target.options.length; i++) {
    if (e.target.options[i].selected) {
      values.push(e.target.options[i].value)
    }
  }

  return values
}

const Select = props =>
  <select
    id={props.id}
    className="form-control"
    value={props.selectedValue}
    disabled={props.disabled}
    onChange={e => props.multiple ? props.onChange(getSelectedValues(e)) : props.onChange(e.target.value)}
    multiple={props.multiple}
  >
    {!props.multiple && props.allowEmpty &&
      <option value=""/>
    }
    {props.options.map(option =>
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )}
  </select>

Select.propTypes = {
  id: T.string.isRequired,
  options: T.arrayOf(T.shape({
    value: T.oneOfType([T.string, T.number, T.bool]).isRequired,
    label: T.string.isRequired
  })).isRequired,
  selectedValue: T.oneOfType([T.string, T.number, T.array, T.bool]).isRequired,
  disabled: T.bool,
  multiple: T.bool,
  allowEmpty: T.bool,
  onChange: T.func.isRequired
}

Select.defaultProps = {
  disabled: false,
  multiple: false,
  allowEmpty: false
}

export {
  Select
}
