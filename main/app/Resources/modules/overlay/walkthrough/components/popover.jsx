import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {Popover} from '#/main/app/overlay/popover/components/popover'

import {trans} from '#/main/core/translation'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'

const WalkThroughPopover = props =>
  <Popover
    placement={props.placement}
    className={classes('walkthrough-popover', props.className)}
    title={props.title}
    positionLeft={props.positionLeft}
    positionTop={props.positionTop}
  >
    <div className="walkthrough-content">
      {props.message}
    </div>

    <div className="walkthrough-actions">
      {props.hasNext &&
        <CallbackButton
          className="btn-link btn-skip"
          callback={props.skip}
          primary={true}
          size="sm"
        >
          {trans('skip', {}, 'actions')}
        </CallbackButton>
      }

      {!props.hasNext &&
        <CallbackButton
          className="btn-link btn-restart"
          callback={props.restart}
          primary={true}
          size="sm"
        >
          {trans('restart', {}, 'actions')}
        </CallbackButton>
      }

      <CallbackButton
        className="btn-link btn-previous"
        callback={props.previous}
        disabled={!props.hasPrevious}
        size="sm"
      >
        <span className="fa fa-angle-double-left" />
        <span className="sr-only">{trans('previous')}</span>
      </CallbackButton>

      <CallbackButton
        className="btn btn-next"
        callback={props.next}
        primary={true}
        size="sm"
      >
        {props.hasNext ? trans('next') : trans('finish', {}, 'actions')}

        {props.hasNext &&
          <span className="fa fa-angle-double-right icon-with-text-left"/>
        }
      </CallbackButton>
    </div>
  </Popover>

WalkThroughPopover.propTypes = {
  className: T.string,
  placement: T.oneOf(['left', 'top', 'right', 'bottom']),
  title: T.string,
  message: T.string.isRequired,
  hasPrevious: T.bool.isRequired,
  hasNext: T.bool.isRequired,
  skip: T.func.isRequired,
  previous: T.func.isRequired,
  next: T.func.isRequired,
  restart: T.func.isRequired
}

WalkThroughPopover.defaultProps = {
  placement: 'bottom'
}

export {
  WalkThroughPopover
}
