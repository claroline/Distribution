import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'

import {trans} from '#/main/core/translation'
import {toKey} from '#/main/core/scaffolding/text/utils'
import {CallbackButton} from '#/main/app/buttons/callback/components/button'
import {Popover} from '#/main/app/overlay/popover/components/popover'

// todo : manage icon components

const WalkThroughEnd = props =>
  <Popover
    id="walkthrough-end-step"
    className="walkthrough-popover walkthrough-popover-centered"
  >
    {props.icon &&
      <span className={classes('walkthrough-icon', props.icon)} />
    }

    <div className="walkthrough-content">
      {props.title &&
        <h3 className="walkthrough-title">{props.title}</h3>
      }

      {props.message}

      {props.link &&
        <a className="walkthrough-link" href={props.link}>
          <span className="fa fa-fw fa-question-circle icon-with-text-right" />
          {trans('learn-more', {}, 'actions')}
        </a>
      }
    </div>

    <div className="walkthrough-btns">
      <CallbackButton
        className="btn"
        callback={props.restart}
      >
        {trans('restart', {}, 'actions')}
      </CallbackButton>

      <CallbackButton
        className="btn"
        callback={props.finish}
        primary={true}
      >
        {trans('finish', {}, 'actions')}
      </CallbackButton>
    </div>
  </Popover>

WalkThroughEnd.propTypes = {
  className: T.string,

  // content
  icon: T.oneOfType([T.string, T.element]),
  title: T.string,
  message: T.string.isRequired,
  link: T.string,

  // navigation
  finish: T.func.isRequired,
  restart: T.func.isRequired
}

WalkThroughEnd.defaultProps = {

}

export {
  WalkThroughEnd
}
