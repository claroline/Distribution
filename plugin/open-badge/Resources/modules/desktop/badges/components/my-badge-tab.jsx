import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'

import {MyBadges} from '#/plugin/open-badge/desktop/badges/components/my-badges'

const MyBadgeTabComponent = () =>
  <Routes
    routes={[
      {
        path: '/my-badges',
        exact: true,
        component: MyBadges
      }
    ]}
  />

MyBadgeTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const MyBadgeTab = connect(
  null,
  null
)(MyBadgeTabComponent)

export {
  MyBadgeTab
}
