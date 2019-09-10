import React from 'react'
import classes from 'classnames'

import {PropTypes as T, implementPropTypes} from '#/main/app/prop-types'
import {Button as ButtonTypes} from '#/main/app/buttons/prop-types'

import {trans} from '#/main/app/intl/translation'
import {Button} from '#/main/app/action/components/button'
import {URL_BUTTON} from '#/main/app/buttons'

const SsoButton = props =>
  <Button
    {...props}
    className={classes('btn-link btn-block btn-emphasis facebook btn-third-party-login', props.service, props.className)}
    type={URL_BUTTON}
    label={props.display_name || trans('login_with_third_party_btn', {name: trans(props.service, {}, 'oauth')})}
    target={['hwi_oauth_service_redirect', {service: props.service}]}
  />

implementPropTypes(SsoButton, ButtonTypes, {
  service: T.func.isRequired,
  label: T.node // lighten validation. We have a default if no label
})

export {
  SsoButton
}
