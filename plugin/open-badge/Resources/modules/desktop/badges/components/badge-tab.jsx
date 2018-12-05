import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/app/router'

import {Badges} from '#/plugin/open-badge/desktop/badges/components/badges'
import {actions}    from '#/plugin/open-badge/desktop/badges/actions'

const BadgeTabComponent = () =>
  <Routes
    routes={[
      {
        path: '/badges',
        exact: true,
        component: Badges
      }
    ]}
  />

BadgeTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const BadgeTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      dispatch(actions.open('badges.current', id))
    }
  })
)(BadgeTabComponent)

export {
  BadgeTab
}
