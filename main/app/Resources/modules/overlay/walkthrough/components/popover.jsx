import React from 'react'
import {PropTypes as T} from 'prop-types'

import {Popover} from '#/main/app/overlay/popover/components/popover'

import {trans} from '#/main/core/translation'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'

const WalkThroughPopover = props => {
  console.log(props)
  return (
    <Popover
      placement={props.placement}
      className="walkthrough-popover"
      title={props.title}
      positionLeft={props.positionLeft}
      positionTop={props.positionTop}
    >
      <div className="walkthrough-content">
        {props.message}
      </div>

      <div className="walkthrough-actions">
        <CallbackButton
          className="btn-link btn-skip"
          callback={props.skip}
          primary={true}
          size="sm"
        >
          {trans('skip', {}, 'actions')}
        </CallbackButton>

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
  )
}

WalkThroughPopover.propTypes = {
  title: T.string,
  message: T.string,
  hasPrevious: T.bool.isRequired,
  hasNext: T.bool.isRequired,
  skip: T.func.isRequired,
  previous: T.func.isRequired,
  next: T.func.isRequired
}

export {
  WalkThroughPopover
}
