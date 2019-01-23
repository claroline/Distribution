import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import merge from 'lodash/merge'

import {getLocale} from '#/main/app/intl/locale'

import {FormGroupWithField as FormGroupWithFieldTypes} from '#/main/core/layout/form/prop-types'
import {FormGroup} from '#/main/app/content/form/components/group.jsx'
import {Textarea} from '#/main/core/layout/form/components/field/textarea.jsx'

const TranslatedGroup = props =>
  <FormGroup
    {...props}
  >
    <Textarea
      id={props.id}
      value={props.value[getLocale()]}
      minRows={props.minRows}
      disabled={props.disabled}
      onChange={(translatedValue) => {
        props.onChange(merge({}, props.value, {[getLocale()]: translatedValue }))
      }}
      onClick={props.onClick}
      onSelect={props.onSelect}
      onChangeMode={props.onChangeMode}
    />
  </FormGroup>

implementPropTypes(TranslatedGroup, FormGroupWithFieldTypes, {
  // more precise value type
  value: T.object,
  // custom props
  minRows: T.number,
  onSelect: T.func,
  onClick: T.func,
  onChangeMode: T.func
})

export {
  TranslatedGroup
}
