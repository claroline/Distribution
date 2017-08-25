import React from 'react'
import {PropTypes as T} from 'prop-types'

import {HelpBlock} from '#/main/core/layout/form/components/help-block.jsx'

const CheckGroup = props =>
  <div className="form-group check-group">
    <div className="checkbox">
      <label htmlFor={props.checkId}>
        <input
          id={props.checkId}
          type="checkbox"
          checked={props.checked}
          onChange={e => props.onChange(e.target.checked)}
        />

        {props.checked && props.labelChecked ? props.labelChecked : props.label}
      </label>
    </div>

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
