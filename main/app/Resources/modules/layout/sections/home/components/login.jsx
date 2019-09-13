/* global window */

import React from 'react'
import {PropTypes as T} from 'prop-types'

import {withRouter} from '#/main/app/router'
import {PageSimple} from '#/main/app/page/components/simple'
import {connect} from 'react-redux'
import {selectors} from '#/main/app/layout/store'

import {constants} from '#/main/app/security/login/constants'
import {LoginForm} from '#/main/app/security/login/containers/form'
import {isAdmin as userIsAdmin} from '#/main/app/security/permissions'

import {route as workspaceRoute} from '#/main/core/workspace/routing'

const LoginPage = (props) =>
  <PageSimple
    className="authentication-page login-page"
  >
    <LoginForm
      onLogin={(response) => {
        if (!userIsAdmin(response.user) && props.maintenance) {
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
  history: T.shape({
    push: T.func.isRequired,
    goBack: T.func.isRequired
  }).isRequired
}

const HomeLogin = withRouter(
  connect(
    (state) => ({
      maintenance: selectors.maintenance(state)
    })
  )(LoginPage))

export {
  HomeLogin
}
