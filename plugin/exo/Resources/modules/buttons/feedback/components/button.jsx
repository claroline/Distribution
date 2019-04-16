import React from 'react'
import classes from 'classnames'
import omit from 'lodash/omit'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {HtmlText} from '#/main/core/layout/components/html-text'
import {Button as ButtonTypes} from '#/main/app/buttons/prop-types'
import {PopoverButton} from '#/main/app/buttons/popover/components/button'

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
    <PopoverButton
      {...omit(props, 'feedback')}
      className={classes('btn-feedback', props.className)}
      popover={{
        className: 'feedback-popover',
        position: 'bottom',
        content: <HtmlText>{props.feedback}</HtmlText>
      }}
    >
      {props.children}
    </PopoverButton>
  )
}

implementPropTypes(FeedbackButton, ButtonTypes, {
  id: T.string.isRequired,
  feedback: T.string
})

export {
  FeedbackButton
}
