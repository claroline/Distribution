import React from 'react'
import classes from 'classnames'

import {trans} from '#/main/app/intl/translation'
import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {copy} from '#/main/app/clipboard'
import {FormField as FormFieldTypes} from '#/main/core/layout/form/prop-types'

import {Button} from '#/main/app/action/components/button'
import {CALLBACK_BUTTON} from '#/main/app/buttons'

const Url = props =>
  <div className="input-group">
    <input
      id={props.id}
      type="text"
      className={classes('form-control', props.className)}
      value={props.value || ''}
      disabled={props.disabled}
      placeholder={props.placeholder}
      onChange={(e) => props.onChange(e.target.value)}
    />

    <span className="input-group-btn">
      <Button
        id={`clipboard-${props.id}`}
        type={CALLBACK_BUTTON}
        tooltip="left"
        label={trans('clipboard_copy')}
        className="btn"
        icon="fa fa-fw fa-clipboard"
        callback={() => copy(props.value)}
      />
    </span>
  </div>

implementPropTypes(Url, FormFieldTypes, {
  value: T.string
})

export {
  Url
}
