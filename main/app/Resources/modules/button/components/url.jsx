import React from 'react'
import classes from 'classnames'
import omit from 'lodash/omit'

import {PropTypes as T, implementPropTypes} from '#/main/core/scaffolding/prop-types'
import {Button as ButtonTypes} from '#/main/app/button/prop-types'
import {url} from '#/main/core/api'

// todo implement confirm behavior

/**
 * URL button.
 * Renders a component that will navigate user to an url (internal or external) on click.
 *
 * IMPORTANT : if you need to navigate inside the current app, use `LinkButton` instead.
 *
 * @param props
 * @constructor
 */
const UrlButton = props => {
  let target = props.target
  if (Array.isArray(target)) {
    target = url(target)
  }

  return (
    <a
      {...omit(props, 'displayed', 'primary', 'dangerous', 'size', 'target', 'confirm')}
      role="link"
      tabIndex={props.tabIndex}
      href={!props.disabled ? target : ''}
      disabled={props.disabled}
      className={classes(props.className, {
        disabled: props.disabled,
        default: !props.primary && !props.dangerous,
        primary: props.primary,
        danger: props.dangerous,
        active: props.active // it may not be useful because by definition an url will change the context
      }, props.size && `btn-${props.size}`)}
    >
      {props.children}
    </a>
  )
}

implementPropTypes(UrlButton, ButtonTypes, {
  target: T.oneOfType([
    T.array, // a symfony url array
    T.string
  ])
})

export {
  UrlButton
}
