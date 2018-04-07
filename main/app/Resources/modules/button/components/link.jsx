import React from 'react'
import {PropTypes as T} from 'prop-types'
import classes from 'classnames'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {NavLink} from '#/main/core/router'
import {Button as ButtonTypes} from '#/main/app/button/prop-types'

/**
 * Link button.
 * Renders a component that will navigate user in the current app on click.
 *
 * @param props
 * @constructor
 */
const LinkButton = props =>
  <NavLink
    {...omit(props, 'displayed', 'primary', 'dangerous', 'size', 'target')}
    tabIndex={props.tabIndex}
    to={props.target}
    exact={props.exact}
    disabled={props.disabled}
    className={classes(props.className, {
      disabled: props.disabled,
      default: !props.primary && !props.dangerous,
      primary: props.primary,
      dangerous: props.dangerous
    }, props.size)}
  >
    {props.children}
  </NavLink>

LinkButton.propTypes = merge({}, ButtonTypes.propTypes, {
  target: T.string,
  exact: T.bool
})

LinkButton.defaultProps = merge({}, ButtonTypes.defaultProps, {
  exact: false
})

export {
  LinkButton
}
