import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {FormGroupWithField as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/app/content/form/components/group'

import {CollectionInput} from '#/main/app/data/types/collection/components/input'

const CollectionGroup = props =>
  <FormGroup
    {...props}
    error={typeof props.error === 'string' ? props.error : undefined}
  >
    <CollectionInput {...props} />
  </FormGroup>

implementPropTypes(CollectionGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.array,

  // mixed error
  error: T.oneOfType([T.string, T.object]),

  // custom props
  min: T.number,
  max: T.number
})

export {
  CollectionGroup
}
