import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {Button as ButtonTypes} from '#/main/app/button/prop-types'
import {CallbackButton} from '#/main/app/button/components/callback'

// TODO implement

/**
 * Async button.
 * Renders a component that will trigger an async call on click.
 *
 * @param props
 * @constructor
 */
const AsyncButton = props =>
  <CallbackButton
    {...omit(props, 'target', 'before', 'success', 'error')}
    callback={() => {

    }}
  >
    {props.children}
  </CallbackButton>

AsyncButton.propTypes = merge({}, ButtonTypes.propTypes, {
  target: T.oneOfType([
    T.string,
    T.array
  ]).isRequired,
  before: T.func,
  success: T.func,
  error: T.func
})

AsyncButton.defaultProps = merge({}, ButtonTypes.defaultProps)

export {
  AsyncButton
}
