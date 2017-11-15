import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

const Password = props =>
  <input
    id={props.id}
    type="password"
    className="form-control"
    value={props.value}
    disabled={props.disabled}
    onChange={(e) => props.onChange(e.target.value)}
  />

implementPropTypes(Password, FormFieldTypes, {
  value: T.string
})

export {
  Password
}
