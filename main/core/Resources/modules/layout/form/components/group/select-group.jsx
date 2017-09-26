import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {Select} from '#/main/core/layout/form/components/field/select.jsx'

const SelectGroup = props =>
  <FormGroup
    {...props}
  >
    <Select
      options={props.options}
      selectedValue={props.selectedValue}
      disabled={props.disabled}
      onChange={props.onChange}
      multiple={props.multiple}
    />
  </FormGroup>

SelectGroup.propTypes = {
  controlId: T.string.isRequired,
  options: T.array.isRequired,
  selectedValue: T.oneOfType([T.string, T.array]).isRequired,
  disabled: T.bool,
  multiple: T.bool,
  onChange: T.func.isRequired
}

export {
  SelectGroup
}
