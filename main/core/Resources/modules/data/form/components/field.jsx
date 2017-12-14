import React from 'react'
import {PropTypes as T} from 'prop-types'
import invariant from 'invariant'
import merge from 'lodash/merge'

import {getTypeOrDefault} from '#/main/core/data'

//import {validateProp} from '#/main/core/data/form/validator'

// todo use validate prop here

const FormField = props => {
  const typeDef = getTypeOrDefault(props.type)
  invariant(typeDef.components.form, `form component cannot be found for '${props.type}'`)

  return React.createElement(typeDef.components.form, merge({}, props.options, {
    id: props.name,
    label: props.label,
    hideLabel: props.hideLabel,
    disabled: props.disabled,
    help: props.help,
    error: props.error,
    warnOnly: !props.validating,
    optional: !props.required,
    value: props.value,
    onChange: props.onChange
  }))
}

// todo : use the one defined in prop-types
FormField.propTypes = {
  validating: T.bool,
  required: T.bool,

  name: T.string.isRequired,
  type: T.string,
  label: T.string.isRequired,
  help: T.string,
  hideLabel: T.bool,
  disabled: T.bool,
  options: T.object,
  onChange: T.func,

  value: T.any,
  error: T.string
}

export {
  FormField
}
