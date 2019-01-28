import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {FormGroupWithField as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/app/content/form/components/group'

import {FilterInput} from '#/main/app/data/types/filter/components/input'

const FilterGroup = props =>
  <FormGroup {...props}>
    <FilterInput {...props} />
  </FormGroup>

implementPropTypes(FilterGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.shape({
    property: T.string,
    value: T.any, // depends on the type data type
    locked: T.bool
  }),

  // custom props
  properties: T.arrayOf(T.shape({
    name: T.string.isRequired,
    label: T.string.isRequired,
    type: T.string.isRequired
  }))
}, {
  value: {}
})

export {
  FilterGroup
}
