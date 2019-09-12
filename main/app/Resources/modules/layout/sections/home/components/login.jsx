/* global window */

import React from 'react'
import {PropTypes as T} from 'prop-types'

import {withRouter} from '#/main/app/router'
import {PageSimple} from '#/main/app/page/components/simple'
import {connect} from 'react-redux'
import {selectors} from '#/main/app/layout/store'
import {selectors as securitySelectors} from '#/main/app/security/store'

import {constants} from '#/main/app/security/login/constants'
import {LoginForm} from '#/main/app/security/login/containers/form'

import {route as workspaceRoute} from '#/main/core/workspace/routing'

const LoginPage = (props) =>
  <PageSimple
    className="login-page"
  >
    <LoginForm
      onLogin={(response) => {
        if (!props.isAdmin && props.maintenance) {
          props.history.push('/maintenance')
        } else {
          if (response.redirect) {
            switch (response.redirect.type) {
              case constants.LOGIN_REDIRECT_LAST:
                props.history.goBack()
                break
              case constants.LOGIN_REDIRECT_DESKTOP:
                props.history.push('/desktop')
                break
              case constants.LOGIN_REDIRECT_WORKSPACE:
                props.history.push(workspaceRoute(response.redirect.data))
                break
              case constants.LOGIN_REDIRECT_URL:
                window.location = response.redirect.data
                break
            }
          }
        }
      }}
    />
  </PageSimple>


LoginPage.propTypes = {
  maintenance: T.bool,
  isAdmin: T.bool,
  history: T.shape({
    push: T.func.isRequired,
    goBack: T.func.isRequired
  }).isRequired
}

const HomeLogin = withRouter(
  connect(
    (state) => ({
      maintenance: selectors.maintenance(state),
      isAdmin: securitySelectors.isAdmin(state)
    })
  )(LoginPage))

export {
  HomeLogin
}
