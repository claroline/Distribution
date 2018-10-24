import React from 'react'
import {connect} from 'react-redux'
import {PropTypes as T} from 'prop-types'

import {withRouter, Routes} from '#/main/app/router'

import {Authentication} from '#/main/core/administration/parameters/technical/components/authentication'
import {Domain} from '#/main/core/administration/parameters/technical/components/domain'
import {Indexing} from '#/main/core/administration/parameters/technical/components/indexing'
import {Limits} from '#/main/core/administration/parameters/technical/components/limits'
import {Mailing} from '#/main/core/administration/parameters/technical/components/mailing'
import {Maintenance} from '#/main/core/administration/parameters/technical/components/maintenance'
import {Pdf} from '#/main/core/administration/parameters/technical/components/pdf'
import {Security} from '#/main/core/administration/parameters/technical/components/security'
import {Synchronization} from '#/main/core/administration/parameters/technical/components/synchronization'
import {Token} from '#/main/core/administration/parameters/technical/components/token'

const SettingsComponent = (props) =>
  <Routes
    redirect={[
      {from: '/', exact: true, to: '/domain' }
    ]}
    routes={[
      {
        path: '/authentication',
        exact: true,
        component: Authentication
      },
      {
        path: '/domain',
        exact: true,
        component: Domain
      }, {
        path: '/indexing',
        exact: true,
        component: Indexing
      }, {
        path: '/limits',
        exact: true,
        component: Limits
      }, {
        path: '/mailing',
        exact: true,
        component: Mailing
      }, {
        path: '/maintenance',
        exact: true,
        component: Maintenance
      }, {
        path: '/pdf',
        exact: true,
        component: Pdf
      }, {
        path: '/security',
        exact: true,
        component: Security
      }, {
        path: '/synchronization',
        exact: true,
        component: Synchronization
      }, {
        path: '/token',
        exact: true,
        component: Token
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
