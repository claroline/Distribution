import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'
import {Routes} from '#/main/core/router'

import {actions} from '#/main/core/administration/user/role/actions'
import {Role,  RoleActions}  from '#/main/core/administration/user/role/components/role.jsx'
import {Roles, RolesActions} from '#/main/core/administration/user/role/components/roles.jsx'

const RoleTabActions = () =>
  <Routes
    routes={[
      {
        path: '/roles',
        exact: true,
        component: RolesActions
      }, {
        path: '/roles/add',
        exact: true,
        component: RoleActions
      }, {
        path: '/roles/:id',
        component: RoleActions
      }
    ]}
  />

const RoleTab = props =>
  <Routes
    routes={[
      {
        path: '/roles',
        exact: true,
        component: Roles
      }, {
        path: '/roles/add',
        exact: true,
        onEnter: () => props.openForm(null),
        component: Role
      }, {
        path: '/roles/:id',
        onEnter: (params) => props.openForm('roles.current', params.id),
        component: Role
      }
    ]}
  />

RoleTab.propTypes = {
  openForm: T.func.isRequired
}

function mapDispatchToProps(dispatch) {
  return {
    openForm: (formName, id = null) => dispatch(actions.open(formName, id))
  }
}

const ConnectedRoleTab = connect(null, mapDispatchToProps)(RoleTab)

export {
  RoleTabActions,
  ConnectedRoleTab as RoleTab
}
