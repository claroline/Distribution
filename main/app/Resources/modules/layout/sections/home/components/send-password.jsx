/* global window */

import React from 'react'

import {PageSimple} from '#/main/app/page/components/simple'

import {SendPasswordForm} from '#/main/app/security/password/send/containers/send'

const SendPassword = () =>
  <PageSimple
    className="authentication-page reset-password"
  >
    <SendPasswordForm/>
  </PageSimple>

export {
  SendPassword
}
