import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {Action as ActionTypes} from '#/main/app/action/prop-types'
import {Button} from '#/main/app/action/components/button'

const FormActions = props =>
  <div className={classes('form-toolbar', props.className)}>
    <Button
      {...props.save}
      className="btn"
      tooltip="top"
      icon="fa fa-fw fa-floppy-o"
      label={trans('save', {}, 'actions')}
      primary={true}
    />

    {props.cancel &&
      <Button
        {...props.cancel}
        className="btn"
        tooltip="top"
        icon="fa fa-fw fa-times"
        label={trans('cancel', {}, 'actions')}
      />
    }
  </div>

FormActions.propTypes = {
  className: T.string,
  save: T.shape(
    ActionTypes.propTypes
  ).isRequired,
  cancel: T.shape(
    ActionTypes.propTypes
  )
}

export {
  FormActions
}