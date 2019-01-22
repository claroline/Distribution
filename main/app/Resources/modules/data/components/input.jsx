import React, {createElement, Component} from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'

import {validateProp} from '#/main/app/content/form/validator'

class DataInput extends Component {
  constructor(props) {
    super(props)

    this.onChange = this.onChange.bind(this)
  }

  componentDidMount() {
    if (definition.components.group) {

    }

    if (definition.components.input) {

    }
  }

  onChange(value) {
    if (this.props.onError) {
      // validate new value
      return validateProp(this.props, value).then(errors => {
        // forward error to the caller
        this.props.onError(errors)

        // forward updated value to the caller
        this.props.onChange(value)
      })
    }

    // forward updated value to the caller
    return this.props.onChange(value)
  }

  render() {
    // the group component to create
    return createElement(DGroup,
      // the props to pass to the group
      {
        id: this.props.id,
        label: this.props.label,
        hideLabel: false,
        help: null,
        warnOnly: false,
        error: null,
        optional: !this.props.required
      },
      // the input component to create
      createElement(DInput,
        // the props to pass to the input
        merge({}, this.props.options, {
          id: this.props.id,
          value: this.props.value,
          placeholder: null,
          disabled: false,
          size: null,
          onChange: this.onChange
        }
      ))
    )
  }
}

DataInput.propTypes = {
  id: T.string.isRequired,
  label: T.string.isRequired,
  value: T.any, // depends on the data type
  options: T.object, // depends on the data type
  required: T.bool,

  onChange: T.func.isRequired,
  onError: T.func
}

DataInput.defaultProps = {
  options: {},
  required: false
}

export {
  DataInput
}
