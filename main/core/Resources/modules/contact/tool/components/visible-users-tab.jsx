import React from 'react'

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

const VisibleUsersTabComponent = () =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: VisibleUsers
      }
    ]}
  />

export {
  VisibleUsersTabActions,
  VisibleUsersTabComponent as VisibleUsersTab
}
