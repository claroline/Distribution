import React from 'react'
import {PropTypes as T} from 'prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {SSO_BUTTON} from '#/main/authentication/buttons/sso'

import {constants} from '#/main/authentication/sso/github/constants'

const GitHubButton = props =>
  <Button
    type={SSO_BUTTON}
    icon={constants.SERVICE_ICON}
    label={props.display_name}
    service={constants.SERVICE_NAME}
  />

GitHubButton.propTypes = {
  display_name: T.string
}

export {
  GitHubButton
}
