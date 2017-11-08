import React from 'react'
import {PropTypes as T} from 'prop-types'
import {connect} from 'react-redux'

import {t} from '#/main/core/translation'

import {DataListContainer as DataList} from '#/main/core/layout/list/containers/data-list.jsx'

import {actions} from '#/main/core/administration/user/role/actions'

import {Route, Switch} from '#/main/core/router'
import {Role,  RoleActions}  from '#/main/core/administration/user/role/components/role.jsx'
import {Roles, RolesActions} from '#/main/core/administration/user/role/components/roles.jsx'

const RoleTabActions = props =>
  <Switch>
    <Route path="/roles" exact={true} component={RolesActions} />
    <Route path="/roles/add" exact={true} component={RoleActions} />
    <Route path="/roles/:id" component={RoleActions} />
  </Switch>

const RoleTab = props =>
  <Switch>
    <Route
      path="/roles"
      exact={true}
      component={Roles}
    />

    <Route
      path="/roles/add"
      exact={true}
      component={Role}
      onEnter={() => props.openForm(null)}
    />

    <Route
      path="/groups/:id"
      component={Role}
      onEnter={(params) => props.openForm(params.uuid)}
    />
  </Switch>

RoleTab.propTypes = {
  openForm: T.func.isRequired
}
function mapDispatchToProps(dispatch) {
  return {
    openForm(id = null) {
      dispatch(actions.open(id))
    }
  }
}

const ConnectedRoleTab = connect(null, mapDispatchToProps)(RoleTab)

export {
  RoleTabActions,
  ConnectedRoleTab as RoleTab
}
