import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Checkbox} from '#/main/core/layout/form/components/field/checkbox.jsx'
import {HelpBlock} from '#/main/core/layout/form/components/help-block.jsx'

const CheckGroup = props =>
  <div className="form-group check-group">
    <Checkbox
      id={props.checkId}
      checked={props.checked}
      label={props.label}
      labelChecked={props.labelChecked}
      onChange={checked => props.onChange(checked)}
    />

    {props.help &&
      <HelpBlock help={props.help} />
    }
  </div>

CheckGroup.propTypes = {
  checkId: T.string.isRequired,
  label: T.string.isRequired,
  labelChecked: T.string,
  checked: T.bool.isRequired,
  onChange: T.func.isRequired,
  help: T.string
}

export {
  CheckGroup
}
