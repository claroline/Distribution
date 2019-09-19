/* global window */

import React from 'react'

import {PageSimple} from '#/main/app/page/components/simple'

import {ResetPasswordForm} from '#/main/app/security/password/containers/form'

const ResetPassword = () =>
  <PageSimple
    className="authentication-page reset-password"
  >
    <ResetPasswordForm/>
  </PageSimple>

export {
  ResetPassword
}
