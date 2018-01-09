import React from 'react'
import {PropTypes as T} from 'prop-types'

import {FormGroup} from '#/main/core/layout/form/components/group/form-group.jsx'
import {Radios} from '#/main/core/layout/form/components/field/radios.jsx'

/**
 * @todo : radios should switch to vertical on xs (maybe sm) screen (MUST be done in less).
 *
 * @param props
 * @constructor
 */
const RadioGroup = props =>
  <FormGroup
    {...props}
  >
    <Radios
      groupName={props.id}
      inline={props.inline}
      options={props.options}
      checkedValue={props.checkedValue}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  </FormGroup>

RadioGroup.propTypes = {
  id: T.string.isRequired,
  options: T.array.isRequired,
  checkedValue: T.oneOfType([T.string, T.number]),
  inline: T.bool.isRequired,
  disabled: T.bool.isRequired,
  onChange: T.func.isRequired
}

RadioGroup.defaultProps = {
  inline: true,
  disabled: false
}

export {
  RadioGroup
}
