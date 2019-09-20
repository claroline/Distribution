/* global window */

import React from 'react'

import {PageSimple} from '#/main/app/page/components/simple'

import {ResetPasswordForm} from '#/main/app/security/password/reset/containers/reset'

const NewPassword = () =>
  <PageSimple
    className="authentication-page reset-password"
  >
    <ResetPasswordForm/>
  </PageSimple>

export {
  NewPassword
}
