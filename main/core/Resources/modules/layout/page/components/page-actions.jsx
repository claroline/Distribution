import React, { PropTypes as T } from 'react'
import classes from 'classnames'

import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger'
import Tooltip from 'react-bootstrap/lib/Tooltip'

// todo : use Tooltip element

/**
 * Base component for each page actions.
 *
 * @param props
 * @constructor
 */
const PageAction = props =>
  <OverlayTrigger
    placement='bottom'
    overlay={
      <Tooltip id={props.id}>{props.title}</Tooltip>
    }
  >
    {typeof props.action === 'function' ?
      <button
        type="button"
        role="button"
        className={classes(
          'btn page-action-btn',
          {
            'disabled': props.disabled,
            'page-action-primary': props.primary
          },
          props.className
        )}
        disabled={props.disabled}
        onClick={() => !props.disabled && props.action()}
      >
        <span className={classes('page-action-icon', props.icon)} aria-hidden={true} />
        {props.children}
      </button>
      :
      <a
        role="link"
        className={classes(
          'btn page-action-btn',
          {
            'disabled': props.disabled,
            'page-action-primary': props.primary
          },
          props.className
        )}
        disabled={props.disabled}
        href={!props.disabled ? props.action : ''}
      >
        <span className={classes('page-action-icon', props.icon)} aria-hidden={true} />
        {props.children}
      </a>
    }
  </OverlayTrigger>

PageAction.propTypes = {
  id: T.string.isRequired,
  primary: T.bool,
  title: T.string.isRequired,
  icon: T.string.isRequired,
  disabled: T.bool,
  children: T.node,
  className: T.string,
  action: T.oneOfType([T.string, T.func]).isRequired
}

PageAction.defaultProps = {
  disabled: false,
  primary: false
}

/**
 * Toggles fullscreen mode.
 *
 * @param props
 * @constructor
 */
const FullScreenAction = props =>
  <PageAction
    id="page-fullscreen"
    title={props.fullscreen ? 'Close fullscreen' : 'Show in fullscreen'}
    icon={classes('fa', {
      'fa-expand': !props.fullscreen,
      'fa-compress': props.fullscreen
    })}
    action={props.toggleFullscreen}
  />

FullScreenAction.propTypes = {
  fullscreen: T.bool.isRequired,
  toggleFullscreen: T.func.isRequired
}

const MoreAction = props =>
  <OverlayTrigger
    placement="bottom"
    overlay={
      <Tooltip id="page-more-title">Show more actions</Tooltip>
    }
  >
    <DropdownButton
      id="page-more"
      title={<span className="page-action-icon fa fa-ellipsis-v" />}
      bsStyle=""
      className="btn page-action-btn"
      noCaret={true}
      pullRight={true}
    >
      {props.children}
    </DropdownButton>
  </OverlayTrigger>

MoreAction.propTypes = {
  children: T.node.isRequired
}

/**
 * Groups some actions together.
 *
 * @param props
 * @constructor
 */
const PageGroupActions = props =>
  <div className={classes('page-actions-group', props.className)}>
    {props.children}
  </div>

PageGroupActions.propTypes = {
  className: T.string,
  children: T.node.isRequired
}

/**
 * Creates actions bar for a page.
 *
 * @param props
 * @constructor
 */
const PageActions = props =>
  <nav className={classes('page-actions', props.className)}>
    {props.children}
  </nav>

PageActions.propTypes = {
  className: T.string,
  children: T.node.isRequired
}

export {
  PageAction,
  FullScreenAction,
  MoreAction,
  PageGroupActions,
  PageActions
}
