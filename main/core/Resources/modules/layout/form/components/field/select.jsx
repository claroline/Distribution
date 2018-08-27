import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

const getSelectedValues = (e) => {
  const values = []

  for (let i = 0; i < e.target.options.length; i++) {
    if (e.target.options[i].selected) {
      values.push(!isNaN(e.target.options[i].value) ? parseFloat(e.target.options[i].value) : e.target.options[i].value)
    }
  }

  return values
}

const Select = props =>
  <select
    id={props.id}
    className="form-control"
    value={props.value || ''}
    disabled={props.disabled}
    onChange={e => props.multiple ?
      props.onChange(getSelectedValues(e)) :
      props.onChange(!isNaN(e.target.value) ? parseFloat(e.target.value) : e.target.value)
    }
    multiple={props.multiple}
  >
    {!props.multiple && !props.noEmpty &&
      <option value=""/>
    }
    {Object.keys(props.choices).map(option =>
      <option key={option} value={option}>
        {props.choices[option]}
      </option>
    )}
  </select>

implementPropTypes(Select, FormFieldTypes, {
  choices: T.object.isRequired,
  value: T.oneOfType([T.string, T.number, T.array]),
  multiple: T.bool,
  noEmpty: T.bool
}, {
  value: '',
  multiple: false,
  noEmpty: false
})

export {
  Select
}
