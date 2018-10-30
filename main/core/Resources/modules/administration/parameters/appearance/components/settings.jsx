import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {withRouter, Routes} from '#/main/app/router'

import {Main} from '#/main/core/administration/parameters/appearance/components/main'
import {Icons} from '#/main/core/administration/parameters/appearance/components/icons'
import {ThemeTool as Themes} from '#/main/core/administration/parameters/appearance/components/theme/components/tool'


const SettingsComponent = (props) =>
  <Routes
    redirect={[
      {from: '/', exact: true, to: '/main' }
    ]}
    routes={[
      {
        path: '/main',
        exact: true,
        component: Main
      },
      {
        path: '/icons',
        exact: true,
        component: Icons
      }, {
        path: '/themes',
        exact: true,
        component: Themes
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
