import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'

import {FormGroup as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'

import {Number} from '#/main/core/layout/form/components/field/number.jsx'

const NumberGroup = props =>
  <FormGroup {...props}>
    <Number {...props} />
  </FormGroup>

implementPropTypes(NumberGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.number,
  // custom props
  min: T.number,
  max: T.number,
  unit: T.string
})

export {
  NumberGroup
}
