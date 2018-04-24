import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {toKey} from '#/main/core/scaffolding/text/utils'
import {TooltipElement} from '#/main/core/layout/components/tooltip-element'
import {GenericButton} from '#/main/app/button/components/generic'

import {Action as ActionTypes} from '#/main/app/action/prop-types'

/**
 * Renders the correct button component for an action.
 *
 * @param props
 * @constructor
 */
const Button = props => props.tooltip ?
  <TooltipElement
    id={`${props.id || toKey(props.label)}-tip`}
    position={props.tooltip}
    tip={props.label}
    disabled={props.disabled}
  >
    <GenericButton
      {...omit(props, 'tooltip', 'group', 'icon', 'label', 'children', 'context')}
    >
      {props.icon &&
        <span className={classes('action-icon', props.icon)} aria-hidden={true} />
      }
      <span className="sr-only">{props.label}</span>
      {props.children}
    </GenericButton>
  </TooltipElement> :
  <GenericButton
    {...omit(props, 'tooltip', 'group', 'icon', 'label', 'children', 'context')}
  >
    {props.icon &&
      <span className={classes('action-icon icon-with-text-right', props.icon)} aria-hidden={true} />
    }
    {props.label}
    {props.children}
  </GenericButton>

Button.propTypes = merge({}, ActionTypes.propTypes, {
  /**
   * If provided, only the icon of the action will be displayed
   * and the label will be rendered inside a tooltip
   *
   * @type {string}
   */
  tooltip: T.oneOf(['left', 'top', 'right', 'bottom']),

  /**
   * The rendering size of the action.
   *
   * @type {string}
   */
  size: T.oneOf(['sm', 'lg'])
})

Button.defaultProps = merge({}, ActionTypes.defaultProps)

export {
  Button
}