import React from 'react'
import {PropTypes as T} from 'prop-types'

import {PageSimple} from '#/main/app/page/components/simple'
import {LoginForm} from '#/main/app/security/login/containers/form'

const HomeLogin = (props) =>
  <PageSimple
    className="login-page"
  >
    <LoginForm
      onLogin={() => {

      }}
    />
  </PageSimple>

HomeLogin.propTypes = {

}

export {
  HomeLogin
}
