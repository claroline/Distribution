import React from 'react'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {FormGroup as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/app/content/form/components/group'

import {FieldsInput} from '#/main/app/data/types/fields/components/input'

const FieldsGroup = props =>
  <FormGroup {...props}>
    <FieldsInput {...props} />
  </FormGroup>

implementPropTypes(FieldsGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.array,
  // custom props
  min: T.number
}, {
  value: []
})

export {
  FieldsGroup
}
