import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {LINK_BUTTON, DOWNLOAD_BUTTON} from '#/main/app/buttons'
import {Routes} from '#/main/app/router'

import {trans} from '#/main/core/translation'
import {
  PageActions,
  PageAction
} from '#/main/core/layout/page/components/page-actions'
import {Connections} from '#/main/core/administration/logs/connection/components/connections'

const ConnectionTabActions = (props) =>
  <PageActions/>

ConnectionTabActions.propTypes = {
}

const ConnectionTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/connections',
        component: Connections,
        exact: true
      }
    ]}
  />

ConnectionTabComponent.propTypes = {
  // openLog: T.func.isRequired
}

const ConnectionTab = connect(
  state => ({
  }),
  dispatch => ({

  })
)(ConnectionTabComponent)

export {
  ConnectionTabActions,
  ConnectionTab
}
