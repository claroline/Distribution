import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {Routes} from '#/main/core/router'
import {VisibleUsers, VisibleUsersActions} from '#/main/core/contact/tool/components/visible-users.jsx'

const VisibleUsersTabActions = () =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: VisibleUsersActions
      }
    ]}
  />

const VisibleUsersTabComponent = props =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: VisibleUsers
      }
    ]}
  />

VisibleUsersTabComponent.propTypes = {
  openForm: T.func.isRequired
}

const VisibleUsersTab = connect(
  null,
  dispatch => ({
    openForm(id = null) {
      // dispatch(actions.open('users.current', id))
    }
  })
)(VisibleUsersTabComponent)

export {
  VisibleUsersTabActions,
  VisibleUsersTab
}
