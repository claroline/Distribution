import React from 'react'
import {PropTypes as T} from 'prop-types'
import merge from 'lodash/merge'
import omit from 'lodash/omit'

import {Button as ButtonTypes} from '#/main/app/button/prop-types'
import {UrlButton} from '#/main/app/button/components/url'

/**
 * Email button.
 * Renders a component that will open the standard user mailer on click.
 *
 * @param props
 * @constructor
 */
const EmailButton = props =>
  <UrlButton
    {...omit(props, 'email')}
    target={`mailto:${props.email}`}
  >
    {props.children || props.email}
  </UrlButton>

EmailButton.propTypes = merge({}, ButtonTypes.propTypes, {
  email: T.string.isRequired
})

EmailButton.defaultProps = merge({}, ButtonTypes.defaultProps)

export {
  EmailButton
}
