import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {Await} from '#/main/app/components/await'

import {getType} from '#/main/app/data/types'
import {DataType as DataTypeTypes} from '#/main/app/data/types/prop-types'
import {validateProp} from '#/main/app/content/form/validator'
import {FormGroup} from '#/main/app/content/form/components/group'

// todo : add loading placeholder
// todo : better error handling on undefined types

const FormInput = props => {
  if (props.readOnly) {
    // TODO : maybe reuse the details component if any.
    return (
      <FormGroup
        id={props.id}
        label={props.label}
        hideLabel={props.hideLabel}
        help={props.help}
      >
        {props.definition.render(props.value, props.options) || '-'}
      </FormGroup>
    )
  }

  return React.createElement(props.definition.components.form, merge({}, props.options, {
    id: props.id,
    label: props.label,
    size: props.size,
    hideLabel: props.hideLabel,
    disabled: props.disabled,
    help: props.help,
    error: props.error,
    warnOnly: !props.validating,
    optional: !props.required,
    value: props.value,
    onChange: (value) => {
      if (props.setErrors) {
        // forward error to the caller
        validateProp(props, value).then(errors => {
          props.setErrors(errors)

          if (props.onChange) {
            // forward updated value to the caller
            props.onChange(value)
          }
        })
      } else if (props.onChange) {
        // forward updated value to the caller
        props.onChange(value)
      }
    }
  }))
}

FormInput.propTypes = {
  id: T.string.isRequired,
  type: T.string.isRequired,
  definition: T.shape(
    DataTypeTypes.propTypes
  ).isRequired,
  label: T.string.isRequired,
  help: T.oneOfType([T.string, T.arrayOf(T.string)]),
  size: T.oneOf(['sm', 'lg']),
  hideLabel: T.bool,
  disabled: T.bool,
  readOnly: T.bool,
  options: T.object,
  required: T.bool,
  value: T.any,
  error: T.oneOfType([T.string, T.arrayOf(T.string), T.object]), // object is for complex types like collection
  validating: T.bool,
  onChange: T.func,
  setErrors: T.func
}

const FormProp = props =>
  <Await
    for={getType(props.type)}
    then={definition => (
      <FormInput {...props} definition={definition} />
    )}
  />

// todo : use the one defined in prop-types
FormProp.propTypes = {
  id: T.string.isRequired,
  type: T.string,
  label: T.string.isRequired,
  options: T.object,
  help: T.oneOfType([T.string, T.arrayOf(T.string)]),
  required: T.bool,
  disabled: T.bool,

  value: T.any,
  error: T.oneOfType([T.string, T.arrayOf(T.string), T.object]), // object is for complex types like collection

  onChange: T.func,
  setErrors: T.func,

  readOnly: T.bool,
  size: T.oneOf(['sm', 'lg']),
  hideLabel: T.bool,
  validating: T.bool
}

export {
  FormProp
}
