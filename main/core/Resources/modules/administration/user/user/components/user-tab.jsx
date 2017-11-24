import React, {Component} from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {Routes} from '#/main/core/router'
import {User,  UserActions}  from '#/main/core/administration/user/user/components/user.jsx'
import {Users, UsersActions} from '#/main/core/administration/user/user/components/users.jsx'


import {actions} from '#/main/core/administration/user/user/actions'

const UserTabActions = props =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: UsersActions
      }, {
        path: '/users/add',
        exact: true,
        component: UserActions
      }, {
        path: '/users/:id',
        component: UserActions
      }
    ]}
  />

const UserTab = props =>
  <Routes
    routes={[
      {
        path: '/users',
        exact: true,
        component: Users
      }, {
        path: '/users/add',
        exact: true,
        component: User,
        onEnter: () => props.openForm(null)
      }, {
        path: '/users/:id',
        component: User,
        onEnter: (params) => props.openForm(params.id)
      }
    ]}
  />

UserTab.propTypes = {
  openForm: T.func.isRequired
}

const ConnectedUserTab = connect(
  null,
  dispatch => ({
    openForm: (id = null) => dispatch(actions.open('users.current', id))
  })
)(UserTab)

export {
  UserTabActions,
  ConnectedUserTab as UserTab
}
