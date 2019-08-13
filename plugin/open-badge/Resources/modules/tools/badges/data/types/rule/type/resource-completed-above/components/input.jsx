import React, {Component, Fragment} from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

import {ResourceInput} from '#/main/core/data/types/resource/components/input'
import {NumberField} from '#/main/app/data/types/number/components/input'

// todo : fix responsive (incorrect margin bottom)
// todo : manages errors

class ResourceCompletedAboveInput extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Fragment>
        <ResourceInput
          onChange={(value) => this.props.onChange(value)}
        />
        <NumberField
          onChange = {(value) => this.props.onChange(value)}
          min={0}
          max={100}
        />
      </Fragment>
    )
  }
}

implementPropTypes(ResourceCompletedAboveInput, FormFieldTypes, {
  // more precise value type
  value: T.arrayOf(T.string)


}, {
  value: null
})

export {
  ResourceCompletedAboveInput
}
