import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'

import {DataGroup as DataGroupTypes, DataInput as DataInputTypes} from '#/main/app/data/types/prop-types'
import {Checkbox} from '#/main/core/layout/form/components/field/checkbox'
import {ContentHelp} from '#/main/app/content/components/help'

const CheckGroup = props =>
  <div className="form-group">
    <Checkbox
      id={props.id}
      checked={props.value}
      disabled={props.disabled}
      label={props.label}
      labelChecked={props.labelChecked}
      onChange={props.onChange}
    />

    {props.help && 0 !== props.help.length &&
      <ContentHelp help={props.help} />
    }
  </div>

implementPropTypes(CheckGroup, [DataGroupTypes, DataInputTypes], {
  // more precise value type
  value: T.bool,
  // custom props
  labelChecked: T.string
}, {
  value: false
})

export {
  CheckGroup
}
