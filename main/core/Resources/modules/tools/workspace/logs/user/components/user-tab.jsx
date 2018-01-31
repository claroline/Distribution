import React from 'react'

import {Routes} from '#/main/core/router'
import {Users, UserActions} from '#/main/core/tools/workspace/logs/user/components/users.jsx'
import {UserDetails, UserDetailsActions} from '#/main/core/tools/workspace/logs/user/components/user-details.jsx'

const UserTabActions = () =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: UserActions
      }, {
        path: '/users/:id',
        exact: true,
        component: UserDetailsActions
      }
    ]}
  />

const UserTab = () =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: Users
      }, {
        path: '/users/:id',
        exact: true,
        component: UserDetails
      }
    ]}
  />

export {
  UserTabActions,
  UserTab
}
