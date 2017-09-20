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
  <fieldset>
    <select
      className="form-control"
      defaultValue={props.selectedValue}
      onChange={e => props.multiple ? props.onChange(getSelectedValues(e)) : props.onChange(e.target.value)}
      multiple={props.multiple}
    >
      {!props.multiple &&
        <option value=""/>
      }
      {props.options.map(option =>
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      )}
    </select>
  </fieldset>

Select.propTypes = {
  options: T.arrayOf(T.shape({
    value: T.string.isRequired,
    label: T.string.isRequired
  })).isRequired,
  selectedValue: T.oneOfType([T.string, T.array]).isRequired,
  multiple: T.bool,
  onChange: T.func.isRequired
}

export {
  Select
}
