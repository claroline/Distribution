import React from 'react'
import classes from 'classnames'
import omit from 'lodash/omit'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {trans} from '#/main/app/intl/translation'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {Button} from '#/main/app/action/components/button'
import {POPOVER_BUTTON} from '#/main/app/buttons/popover'

/**
 * Feedback button.
 * Renders a component that will open an answer feedback.
 *
 * @param props
 * @constructor
 */
const FeedbackButton = props => {
  if (!props.feedback) {
    return (
      <span className="btn-feedback" />
    )
  }

  return (
    <Button
      {...omit(props, 'feedback')}
      className={classes('btn-link btn-feedback', props.className)}
      type={POPOVER_BUTTON}
      icon="fa fa-fw fa-comments-o"
      label={trans('show-feedback', {}, 'actions')}
      tooltip="left"
      popover={{
        className: 'feedback-popover',
        position: 'bottom',
        content: <HtmlText>{props.feedback}</HtmlText>
      }}
    />
  )
}

FeedbackButton.propTypes = {
  id: T.string.isRequired,
  feedback: T.string
}

export {
  FeedbackButton
}
