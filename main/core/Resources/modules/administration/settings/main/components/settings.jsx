import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {withRouter, Routes} from '#/main/app/router'

import {Main} from '#/main/core/administration/settings/main/components/page/main'
import {I18n} from '#/main/core/administration/settings/main/components/page/i18n'
import {Plugins} from '#/main/core/administration/settings/main/components/page/plugins'
import {Portal} from '#/main/core/administration/settings/main/components/page/portal'


const SettingsComponent = (props) =>
  <Routes
    redirect={[
      {from: '/', exact: true, to: '/received' }
    ]}
    routes={[
      {
        path: '/main',
        exact: true,
        component: Main
      },
      {
        path: '/i18n',
        exact: true,
        component: I18n
      }, {
        path: '/plugins',
        exact: true,
        component: Plugins
      }, {
        path: '/portal',
        exact: true,
        component: Portal
      }
    ]}
  />

SettingsComponent.propTypes = {
}

const Settings = withRouter(connect(
  state => ({ }),
  dispatch => ({ })
)(SettingsComponent))


export {
  Settings
}
