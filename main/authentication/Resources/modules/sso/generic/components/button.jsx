import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {SSO_BUTTON} from '#/main/authentication/buttons/sso'

import {constants} from '#/main/authentication/sso/generic/constants'

const GenericButton = props =>
  <Button
    {...props}
    type={SSO_BUTTON}
    icon={constants.SERVICE_ICON}
    service={constants.SERVICE_NAME}
  />

export {
  GenericButton
}
