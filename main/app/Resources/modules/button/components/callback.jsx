import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {Button as ButtonTypes} from '#/main/app/button/prop-types'

/**
 * Callback button.
 * Renders a component that will trigger a callback on click.
 *
 * @param props
 * @constructor
 */
const CallbackButton = props =>
  <button
    {...omit(props, 'displayed', 'primary', 'dangerous', 'size', 'callback', 'bsRole', 'bsClass')}
    type="button"
    role="button"
    tabIndex={props.tabIndex}
    disabled={props.disabled}
    className={classes(props.className, {
      disabled: props.disabled,
      default: !props.primary && !props.dangerous,
      primary: props.primary,
      dangerous: props.dangerous
    }, props.size)}
    onClick={(e) => {
      if (!props.disabled) {
        props.callback(e)
      }

      e.preventDefault()
      e.stopPropagation()

      e.target.blur()

      if (!props.disabled && props.onClick) {
        // execute the default click callback if any (mostly to make dropdown works)
        props.onClick(e)
      }
    }}
  >
    {props.children}
  </button>

CallbackButton.propTypes = merge({}, ButtonTypes.propTypes, {
  callback: T.func.isRequired
})

CallbackButton.defaultProps = merge({}, ButtonTypes.defaultProps)

export {
  CallbackButton
}
