import React from 'react'
import {PropTypes as T, implementPropTypes} from '#/main/core/prop-types'
import classes from 'classnames'

import {FormGroup as FormGroupTypes} from '#/main/core/layout/form/prop-types'
import {ErrorBlock} from '#/main/core/layout/form/components/error-block.jsx'
import {HelpBlock} from '#/main/core/layout/form/components/help-block.jsx'

const FormGroup = props =>
  <div className={classes('form-group', props.className, {
    'has-error': props.error && !props.warnOnly,
    'has-warning': props.error && props.warnOnly
  })}>
    <label
      className={classes('control-label', {'sr-only': props.hideLabel})}
      htmlFor={props.id}
    >
      {props.label}
    </label>

    {props.children}

    {props.error &&
      <ErrorBlock text={props.error} inGroup={true} warnOnly={props.warnOnly}/>
    }

    {props.help &&
      <HelpBlock help={props.help} />
    }
  </div>

implementPropTypes(FormGroup, FormGroupTypes, {
  children: T.node.isRequired
})

export {
  FormGroup
}
